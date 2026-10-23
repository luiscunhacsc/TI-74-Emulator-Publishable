'use strict';
// Release checks require no manufacturer firmware or external dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),folder=path.join(root,'public');
const expected=['LICENSE.txt','README.md','README.pt-PT.md','index.html','index.pt-PT.html'].sort();
assert(!fs.lstatSync(folder).isSymbolicLink());
assert.deepEqual(fs.readdirSync(folder).sort(),expected,'Release must contain only approved files');
for(const name of expected){
  const file=path.join(folder,name);
  assert(fs.lstatSync(file).isFile(),'Release entry must be a regular file');
  const text=fs.readFileSync(file,'utf8');
  assert(!/[A-Za-z0-9+/]{1024,}={0,2}/.test(text),'Unexpected encoded payload: '+name);
}
for(const [name,source] of [['index.html','index.en-US.html'],['index.pt-PT.html','index.html']]){
  const html=fs.readFileSync(path.join(folder,name),'utf8');
  const original=fs.readFileSync(path.join(root,source),'utf8').replace(/\r\n/g,'\n');
  const script=(text,id)=>text.match(new RegExp('<script id="'+id+'"[^>]*>([\\s\\S]*?)<\\/script>'))[1];
  assert.equal(JSON.parse(script(html,'embedded-roms')),null,'Manufacturer ROMs must never be embedded');
  assert.equal(script(html,'emulator-core'),script(original,'emulator-core'),'Core and license must remain unchanged');
  new vm.Script(script(html,'emulator-ui'));
  const core={};vm.runInNewContext(script(html,'emulator-core'),core);
  const {TI74,diagnosticROM}=core.TI74Core,rom=diagnosticROM(),machine=new TI74();
  machine.load(rom.internal,rom.system,'diagnostic');machine.run(100000);
  assert.match(machine.lcd.text(),/DIAGNOSTIC/);
  const library=JSON.parse(script(html,'program-library'));
  assert.equal(library.programs.length,20);
  assert.deepEqual(library.programs,JSON.parse(script(original,'program-library')).programs);
  assert.match(html,/<title>Pocket BASIC Emulator<\/title>/);
  assert.match(html,/<h1>Pocket BASIC Emulator<\/h1>/);
  assert(!/TEXAS INSTRUMENTS|scribd\.com|casio\.ledudu\.com/.test(html));
  assert.match(html,/c70009\.ic2 · 4096 bytes · CRC32 55A2F7C0/);
  assert.match(html,/1060281-101_hn61256pd12\.ic1 · 32768 bytes · CRC32 019AAA2F/);
  assert.match(html,/id="rom-policy"/);
  assert.match(html,/pocket-basic-public-firmware-v1/);
  assert(!html.includes("ROM_KEY='ti74-"),'Private browser storage must not be reused');
  assert(!/<(?:script|img|iframe|link)[^>]+(?:src|href)\s*=/i.test(html),'No external assets should load automatically');
  console.log('PASS '+name+': no bundled ROMs, neutral branding, unchanged core/license, diagnostic, library and ROM identifiers');
}
console.log('Public release checks passed.');
