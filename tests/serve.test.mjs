import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
test('dependency-free preview serves the dataset, blocks private paths, and supports HEAD',{timeout:10000},async()=>{
  const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:new URL('../',import.meta.url),stdio:['ignore','pipe','pipe']});
  try {
    await Promise.race([
      once(child.stdout,'data'),
      once(child,'exit').then(([code])=>{throw new Error(`preview failed to start (${code}); port 4173 must be free`);})
    ]);
    const base='http://127.0.0.1:4173';
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
