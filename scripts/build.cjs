'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
// Explicit allowlist prevents prototype data, source, tests and secrets from being published.
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
for(const name of [...files,'pages','contacto','styles.css','robots.txt','sitemap.xml','.nojekyll'])fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});
fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for(const name of ['logo-perlatech.png','hero-art.jpg','js'])fs.cpSync(path.join(root,'assets',name),path.join(out,'assets',name),{recursive:true});
console.log('GitHub Pages: archivos públicos generados en dist/.');
