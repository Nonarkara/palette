import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createServer} from 'node:net';

// A port the test owns, so a developer's own preview on 4173 cannot make CI
// fail with "port 4173 must be free". The server takes PORT; use a random one.
async function freePort(){
  const s=createServer();
  await new Promise(r=>s.listen(0,'127.0.0.1',r));
  const p=s.address().port;
  await new Promise(r=>s.close(r));
  return p;
}

test('dependency-free preview serves the dataset, blocks private paths, and supports HEAD',{timeout:15000},async()=>{
  const port=await freePort();
  const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:new URL('../',import.meta.url),stdio:['ignore','pipe','pipe'],env:{...process.env,PORT:String(port)}});
  try {
    await Promise.race([
      once(child.stdout,'data'),
      once(child,'exit').then(([code])=>{throw new Error(`preview failed to start (${code})`);})
    ]);
    const base=`http://127.0.0.1:${port}`;
    assert.equal((await fetch(base)).status,200);
    const data=await fetch(base+'/data/colors.json');
    assert.equal(data.status,200);assert.match(data.headers.get('content-type'),/application\/json/);
    assert.ok(await data.json());
    assert.equal((await fetch(base+'/.git/config')).status,404);
    assert.equal((await fetch(base+'/%2e%2e%2fREADME.md')).status,404);
    assert.equal((await fetch(base+'/index.html',{method:'HEAD'})).status,200);
    assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
  } finally {if(child.exitCode===null){child.kill();await once(child,'exit');}}
});
