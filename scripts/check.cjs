'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root);let links=0;
for(const file of files){
 if(file.endsWith('.js'))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
 if(!file.endsWith('.html'))continue;
 const html=fs.readFileSync(file,'utf8');assert.match(html,/<html lang="es">/);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  let url=match[1];if(/^(https?:|mailto:|tel:|data:)/.test(url))continue;
  const [raw,hash]=url.split('#');let target;
  if(!raw)target=file;else if(raw.startsWith('/perlatechlatam.github.io/'))target=path.join(root,raw.slice('/perlatechlatam.github.io/'.length).split('?')[0]);else target=path.resolve(path.dirname(file),raw.split('?')[0]);
  assert.ok(target.startsWith(root+path.sep),`Referencia fuera de dist: ${url}`);
  assert.ok(fs.existsSync(target),`Enlace roto en ${path.relative(root,file)}: ${url}`);
  if(hash && target.endsWith('.html') && !path.basename(target).startsWith('demo')){const dest=fs.readFileSync(target,'utf8');assert.ok(dest.includes(`id="${hash}"`),`Ancla inexistente: ${url}`);}links++;
 }
 assert.ok(!html.includes('perlatech.cl'),'Dominio anterior no permitido');assert.ok(!html.includes('+200'),'Métrica no verificada');
}
for(const forbidden of ['data','server.js','package.json','.env','.git','node_modules'])assert.ok(!fs.existsSync(path.join(root,forbidden)),`Archivo privado publicado: ${forbidden}`);
console.log(`${files.filter(f=>f.endsWith('.html')).length} páginas y ${links} referencias locales verificadas. JavaScript válido. Sin archivos privados en dist.`);
