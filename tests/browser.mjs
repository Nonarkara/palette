import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd();
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  try {
    const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
    if(!file.startsWith(root+path.sep)&&file!==root) {res.writeHead(403).end();return;}
    const target=file===root?path.join(root,'index.html'):file;
    const bytes=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'}).end(bytes);
  } catch {res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=process.env.PALETTE_TEST_URL||`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch();
const page=await browser.newPage({acceptDownloads:true});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
await page.route(/fonts\.(googleapis|gstatic)\.com/,route=>route.abort());
await mkdir('/tmp/palette-check',{recursive:true});
try {
  await page.goto(base+'#plate-001',{waitUntil:'domcontentloaded'});
  await page.locator('#plate-number').filter({hasText:'PLATE 001'}).waitFor();
  await page.locator('[data-action="search"]').click();
  for(const query of ['calm ocean','red and black','minimalist website','สีแดงสีดำ','红色黑色','purpl','#cc1236','plate 042']) {
    await page.locator('#search-input').fill(query);
    assert.ok(await page.locator('#search-results button').count(),query);
  }
  await page.locator('#search-input').fill('calm zzzxxyy');
  assert.match(await page.locator('#search-explainer').innerText(),/not every word matched/);
  await page.locator('#search-input').fill('zzzxxyy');
  assert.equal(await page.locator('#search-results button').count(),0);
  assert.match(await page.locator('#search-explainer').innerText(),/No match/);
  await page.locator('#search-input').fill('42');
  await page.locator('#search-results button').click();
  assert.match(await page.locator('#plate-number').innerText(),/042/);
  const colors=JSON.parse(await readFile('data/colors.json','utf8'));
  const groups=new Map();colors.forEach(c=>c.combinations.forEach(id=>groups.set(id,[...(groups.get(id)||[]),c])));
  for(const count of [2,3,4]) {
    const [id,palette]=[...groups].find(([,cs])=>cs.length===count);
    await page.goto(base+`#plate-${String(id).padStart(3,'0')}`,{waitUntil:'domcontentloaded'});
    await page.locator('[data-action="wallpaper"]').click();
    for(const [device,width,height] of [['phone',1440,3120],['tablet',2048,2732],['desktop',3840,2160]]) {
      await page.locator('#wallpaper-device').selectOption(device);
      await page.locator('#wallpaper-labels').uncheck();
      const pixels=await page.locator('#wallpaper-preview').evaluate(canvas=>{
        const ctx=canvas.getContext('2d');
        return {width:canvas.width,height:canvas.height,first:Array.from(ctx.getImageData(5,5,1,1).data).slice(0,3)};
      });
      assert.equal(pixels.width,width);assert.equal(pixels.height,height);assert.deepEqual(pixels.first,palette[0].rgb);
      await page.locator('#wallpaper-labels').check();
      const event=page.waitForEvent('download');await page.locator('#wallpaper-download').click();
      const download=await event;
      const filename=download.suggestedFilename();
      assert.equal(filename,`palette-${String(id).padStart(3,'0')}-${device}-${width}x${height}.png`);
      await download.saveAs('/tmp/palette-check/'+filename);
      const bytes=await readFile('/tmp/palette-check/'+filename);
      assert.equal(bytes.subarray(1,4).toString(),'PNG');
      assert.equal(bytes.readUInt32BE(16),width);assert.equal(bytes.readUInt32BE(20),height);
    }
    await page.locator('[aria-label="Close wallpaper download"]').click();
  }
  for(const width of [375,768,1280]) {
    await page.setViewportSize({width,height:900});
    await page.locator('[data-action="wallpaper"]').click();
    const sizes=await page.evaluate(()=>({width:innerWidth,doc:document.documentElement.scrollWidth,dialog:document.querySelector('#wallpaper-dialog').scrollWidth}));
    assert.ok(sizes.doc<=width && sizes.dialog<=width,`Overflow at ${width}`);
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('#wallpaper-dialog')).opacity==='1');
    await page.screenshot({path:`/tmp/palette-check/wallpaper-${width}.png`});
    await page.keyboard.press('Escape');
    await page.locator('[data-action="json"]').click();
    assert.ok(JSON.parse(await page.locator('#json-code').innerText()).colors.length>=2);
    await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: phrase/multilingual/empty search; 9 PNG downloads with correct names and dimensions; raw colours; JSON regression; 375/768/1280 layout; zero JS errors.');
} finally {await browser.close(); await new Promise(resolve=>server.close(resolve));}
