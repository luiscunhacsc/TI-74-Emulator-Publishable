'use strict';
// Build the offline US English edition from the shared emulator and translations.
// This never downloads firmware: the packaged edition reuses the owner's local ROMs.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.join(__dirname,'..'),check=process.argv.includes('--check');
const read=file=>fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
const translations=JSON.parse(read('locales/en-US.json'));
const library=JSON.parse(read('programs/en-US/library.json'));
const originalLibrary=JSON.parse(read('programs/library.json'));
assert.equal(library.locale,'en-US');
assert.equal(library.programs.length,originalLibrary.programs.length);
const ids=new Set();
for(const [index,item] of library.programs.entries()){
 assert.match(item.id,/^\d{2}-[a-z0-9-]+$/);assert(!ids.has(item.id),'Duplicate example');ids.add(item.id);
 assert.equal(item.id.slice(0,2),originalLibrary.programs[index].id.slice(0,2),'Example order differs');
 for(const field of ['title','category','level','summary','instructions','expected','experiment','code'])assert.equal(typeof item[field],'string',item.id+': '+field);
 for(const field of ['concepts','notes'])assert(Array.isArray(item[field])&&item[field].length&&item[field].every(v=>typeof v==='string'),item.id+': '+field);
 let previous=0;
 for(const line of item.code.split('\n')){
  assert.match(line,/^[1-9]\d* [\x20-\x7e]+$/,item.id+': invalid BASIC line');
  const number=Number(line.split(' ')[0]);assert(number>previous&&number<32767,item.id+': line order');previous=number;
  assert(line.length<=80,item.id+': line exceeds the TI-74 input limit');
 }
}
function output(relative,content){
 if(check)assert.equal(read(relative),content,relative+' is stale; run node tools/localize.cjs');
 else fs.writeFileSync(path.join(root,relative),content,'utf8');
}
const libraryMarker=/<script id="program-library" type="application\/json">[\s\S]*?<\/script>/;
const romMarker=/<script id="embedded-roms" type="application\/json">([\s\S]*?)<\/script>/;
let source=read('index.html');
assert(libraryMarker.test(source),'Missing library marker');
source=source.replace(libraryMarker,'<!-- EN-US-LIBRARY -->');
const keys=Object.keys(translations).sort((a,b)=>b.length-a.length);
for(const key of keys){
 assert(source.includes(key),'Translation source no longer exists: '+key);
 assert.equal(typeof translations[key],'string');
}
// One pass, longest match first: avoid translating text inside another translation.
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp(keys.map(escape).join('|'),'g');
const used=new Set();
source=source.replace(pattern,key=>{used.add(key);return translations[key];});
for(const key of keys)assert(used.has(key),'Unused translation: '+key);
const embedded='<script id="program-library" type="application/json">'+JSON.stringify(library).replace(/</g,'\\u003c')+'</script>';
source=source.replace('<!-- EN-US-LIBRARY -->',()=>embedded);
for(const id of ['emulator-core','emulator-ui'])new vm.Script(source.match(new RegExp('<script id="'+id+'">([\\s\\S]*?)<\\/script>'))[1],{filename:id+'.en-US.js'});
assert.match(source,/<html lang="en-US">/);
assert.equal(JSON.parse(source.match(romMarker)[1]),null,'Source must not contain firmware');
output('index.en-US.html',source);
if(!process.argv.includes('--source-only')){
 const packed=read('TI-74.html'),match=packed.match(romMarker);
 assert(match,'Missing firmware marker in TI-74.html');
 const roms=JSON.parse(match[1]);
 assert(roms,'TI-74.html has no embedded firmware; use --source-only and tools/package.cjs with local ROM files');
 assert.equal(Buffer.from(roms.internal,'base64').length,4096);
 assert.equal(Buffer.from(roms.system,'base64').length,32768);
 output('TI-74.en-US.html',source.replace(romMarker,()=>match[0]));
}
for(const item of library.programs)output('programs/en-US/'+item.id+'.bas',item.code+'\n');
let guide=`# TI-74 program library (US English)\n\n${library.programs.length} original examples, from your first program to subprograms with parameters. The BASIC files use only ASCII characters supported by the TI-74 keyboard.\n\n`;
guide+='## Getting started\n\n1. Open `TI-74.en-US.html` and select BASIC mode. Press CLR if you see `W30 Initialized`.\n2. In the **BASIC Library**, search for a topic or command and select an example.\n3. **Copy to editor** places the code in the editor. **Restore previous text** undoes this step.\n4. **Send to TI-74** enters the lines. **Replace… (NEW)** is selected for examples and erases the previous program; save the state first if you want to keep it.\n5. Wait for **Text entered**, press **RUN**, then **ENTER**. Follow the instructions for the example.\n\n';
guide+='Code is entered through the emulated keyboard; speed 4× reduces the wait. `PRINT` followed by `PAUSE` keeps each result visible; press ENTER to continue. Use BREAK to interrupt. Examples are independent: load one at a time. The editor and downloads work without ROMs; running programs requires TI ROMs. Use a period for decimals and enter numbers without thousands separators.\n\n';
guide+='## Learning path\n\n| Program | Topic | Level | Syntax |\n| --- | --- | --- | --- |\n';
for(const item of library.programs)guide+=`| [${item.title}](${item.id}.bas) | ${item.category} | ${item.level} | ${item.concepts.map(v=>'`'+v+'`').join(', ')} |\n`;
for(const item of library.programs){
 guide+=`\n## ${item.id.slice(0,2)} · ${item.title}\n\n${item.summary}\n\n[Download program](${item.id}.bas)\n\n**Run:** ${item.instructions}\n\n**Expected output:** ${item.expected}\n\n`;
 guide+=item.notes.map(note=>'- '+note).join('\n')+`\n\n**Try it:** ${item.experiment}\n`;
}
guide+='\n## Maintenance and verification\n\nEdit `programs/en-US/library.json`, then run `node tools/localize.cjs` from the project root to update the `.bas` files, this guide, and both English HTML files. `node tools/localize.cjs --check` checks synchronization without writing.\n\n';
guide+='Run `node tests/library.test.cjs --en-US` to enter and execute all 20 examples through the keyboard using the ROMs already embedded in `TI-74.en-US.html`. The test also accepts paths to local CPU and system ROM files. Tests do not contain firmware copies.\n\n';
guide+=`Syntax reference: [Texas Instruments, TI-74 Programming Reference Guide](${library.reference}). The programs and explanations are original; they are not transcriptions of the manual examples.\n\n`;
guide+='These examples cover features available in this emulator. Cassette storage, printers, DOCK-BUS, and RAM cartridges are not implemented.\n';
output('programs/en-US/README.md',guide);
console.log((check?'Verified':'Generated')+' US English edition, '+library.programs.length+' examples, and learning guide.');
