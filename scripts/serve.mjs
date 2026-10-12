// Dependency-free, loopback-only static preview. Never serve private dotfiles.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fs.realpathSync(fileURLToPath(new URL('../',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
  '.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png',
  '.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
  try {
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const url=new URL(req.url,'http://127.0.0.1');
    const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    if(relative.split(/[\\/]/).some(p=>p.startsWith('.'))){res.writeHead(404);res.end();return;}
    const filename=fs.realpathSync(path.resolve(root,relative));
    if(!filename.startsWith(root+path.sep)||!fs.statSync(filename).isFile()){
      res.writeHead(404);res.end();return;
    }
    res.setHeader('Content-Type',mime[path.extname(filename)]||'application/octet-stream');
    res.setHeader('Cache-Control','no-store');
    if(req.method==='HEAD')res.end();else fs.createReadStream(filename).pipe(res);
  } catch {res.writeHead(404);res.end();}
});
server.on('error',err=>{
  console.error(err.code==='EADDRINUSE' ? 'Port 4173 is already in use. Stop the other preview before starting Palette.' : err.message);
  process.exitCode=1;
});
server.listen(4173,'127.0.0.1',()=>console.log('Palette: http://127.0.0.1:4173 — Ctrl-C to stop.'));
