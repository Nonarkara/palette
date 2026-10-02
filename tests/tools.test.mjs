import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const ctx={window:{}};
for(const file of ['content.js','palette-tools.js','app.js']) {
  let source=await readFile(new URL('../'+file,import.meta.url),'utf8');
  if(file==='app.js') source=source.replace('  init();','  window.testPalettes = buildPalettes;');
  vm.runInNewContext(source,ctx);
}
const colors=JSON.parse(await readFile(new URL('../data/colors.json',import.meta.url),'utf8'));
const palettes=ctx.window.testPalettes(colors);
const tools=ctx.window.PALETTE_TOOLS;
test('ordinary moods, purposes and colour phrases find source palettes',()=>{
  for(const query of ['calm','relaxing','minimalist website','ocean','cozy','earthy','pastel','red and black','pink','purple','grey','brown','beige','romantic','peace','summer','book cover','สงบ','สีแดงสีดำ','ทะเล','红色黑色','平静','网站','#cc1236','42','plate 042']) {
    assert.ok(tools.search(palettes,query).results.length,`No results: ${query}`);
  }
  assert.equal(tools.search(palettes,'42').results[0].id,42);
  for(const p of tools.search(palettes,'red and black').results) {
    assert.ok(p.tags.includes('red') && p.tags.includes('black'),'both colour families must match');
  }
});
test('stopwords, spelling, hex, empty and unknown queries behave honestly',()=>{
  assert.deepEqual(Array.from(tools.termsFor('I want a calm palette')),['quiet']);
  assert.equal(tools.search(palettes,'purpl').results.length,tools.search(palettes,'purple').results.length);
  const hex=tools.search(palettes,'#cc1236');
  assert.ok(hex.results.every(p=>p.colors.some(c=>c.hex.toLowerCase()==='#cc1236')));
  assert.equal(tools.search(palettes,'').results.length,348);
  assert.equal(tools.search(palettes,'zzzxxyy').results.length,0);
  assert.equal(tools.search(palettes,'calm zzzxxyy').related,true);
  assert.equal(tools.search(palettes,'999').results.length,0);
});
test('all 348 wallpaper plans cover each device exactly without invented colours',()=>{
  for(const p of palettes) for(const device of Object.keys(tools.sizes)) {
    const plan=tools.wallpaperPlan(p,device);
    assert.equal(plan.fields.length,p.colors.length);
    assert.equal(plan.fields.reduce((sum,f)=>sum+f.width*f.height,0),plan.width*plan.height);
    plan.fields.forEach((f,i)=>{
      assert.equal(f.color.hex,p.colors[i].hex);
      assert.ok(f.width>0 && f.height>0);
      assert.ok(f.x+f.width<=plan.width && f.y+f.height<=plan.height);
      if(i) assert.equal(plan.height>plan.width?f.y:f.x,plan.height>plan.width?plan.fields[i-1].y+plan.fields[i-1].height:plan.fields[i-1].x+plan.fields[i-1].width);
    });
  }
  assert.throws(()=>tools.wallpaperPlan(palettes[0],'unknown'));
});
