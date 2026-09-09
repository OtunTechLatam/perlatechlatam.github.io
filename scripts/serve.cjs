'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
require('./build.cjs');
const root=path.resolve(__dirname,'../dist'),base='/perlatechlatam.github.io/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 if(pathname==='/'){res.writeHead(302,{Location:base});res.end();return;}
 if(!pathname.startsWith(base)){res.writeHead(404).end('Not found');return;}
 let file=path.resolve(root,pathname.slice(base.length)||'index.html');
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 const exists=fs.existsSync(file)&&fs.statSync(file).isFile();if(!exists)file=path.join(root,'404.html');
 res.writeHead(exists?200:404,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Abre http://localhost:4173/perlatechlatam.github.io/ · Ctrl+C para terminar.'));
