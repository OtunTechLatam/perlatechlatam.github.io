'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const rootHtml=fs.readdirSync(root).filter(name=>name.endsWith('.html'));
const publicEntries=[...rootHtml,'pages','contacto','assets','styles.css','robots.txt','sitemap.xml','.nojekyll'];
for(const name of publicEntries){
  const src=path.join(root,name);if(!fs.existsSync(src))continue;
  fs.cpSync(src,path.join(out,name),{recursive:true});
}
console.log('PerlaTech: dist/ generado con la lista pública permitida.');
