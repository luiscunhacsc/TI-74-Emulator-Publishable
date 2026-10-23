'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const english=process.argv.includes('--en-US');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,english?'index.en-US.html':'index.html'),'utf8');
vm.runInThisContext(html.match(/<script id="emulator-core">([\s\S]*?)<\/script>/)[1]);
const {TI74}=globalThis.TI74Core;
const library=JSON.parse(fs.readFileSync(path.join(root,english?'programs/en-US/library.json':'programs/library.json'),'utf8'));
const {KEY,symbols}=vm.runInNewContext(html.slice(html.indexOf('const KEY='),html.indexOf('let machine=new TI74()'))+';({KEY,symbols})');
const [cpuFile,systemFile]=process.argv.slice(2).filter(arg=>arg!=='--en-US');
let internal,system;
if(cpuFile&&systemFile){internal=fs.readFileSync(cpuFile);system=fs.readFileSync(systemFile);}
else{
 const packed=fs.readFileSync(path.join(root,english?'TI-74.en-US.html':'TI-74.html'),'utf8');
 const rom=JSON.parse(packed.match(/<script id="embedded-roms" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 internal=Buffer.from(rom.internal,'base64');system=Buffer.from(rom.system,'base64');
}
const cases=english?require('./library.en-US.cases.cjs'):{
 '01-hello':[['','OLA,TI-74!']],
 '02-arithmetic':[['','A=14B=20'],['\n','C=41']],
 '03-sum':[['','SOMA=55']],
 '04-countdown':[['','3'],['\n','2'],['\n','1'],['\n','PARTIDA']],
 '05-temperature':[['','CELSIUS?'],['25\n','F=77']],
 '06-decisions':[['','NUMERO0A100?'],['-1\n','INTEIRODE0A100'],['\n','NUMERO0A100?'],['2.5\n','INTEIRODE0A100'],['\n','NUMERO0A100?'],['7\n','IMPAR']],
 '07-strings':[['','BASIC/ALC'],['\n','LEN=8POS=5']],
 '08-ascii':[['','ASCII=65'],['\n','LETRA=B'],['\n','DOBRO=25']],
 '09-data':[['','TOTAL=30'],['\n','PRIMEIRO=4']],
 '10-statistics':[['','MEDIA=5'],['\n','DESVIO=2']],
 '11-matrix':[['','DET=-2']],
 '12-gosub':[['','H1=5'],['\n','H2=13']],
 '13-subprogram':[['','DOBRO=14']],
 '14-science':[['',/^GRAUS=0?\.5$/],['\n',/^RADIANOS=0?\.5$/],['\n','LOG=3LNEXP=2']],
 '15-formatting':[['','12.50'],['\n','3.14']],
 '16-dice':[['',/^DADOS=[1-6][1-6]$/],['\n',/^SOMA=([2-9]|1[0-2])$/]],
 '17-sorting':[['','1'],['\n','2'],['\n','4'],['\n','7'],['\n','9']],
 '18-display':[['','TI-74********'],['\n','COLUNA8']],
 '19-keyboard':[['','PRIMEUMALETRA'],['A','TECLA=A'],['\n','CODIGO=65']],
 '20-newton':[['','NUMEROPOSITIVO?'],['2\n',/^NEWTON=1\.41421356\d*$/],['\n',/^SQR=1\.41421356\d*$/]]
};
const m=new TI74();m.load(internal,system);m.run(2000000);
function tap(names){
 const modifiers=names.filter(n=>['SHIFT','FN','CTL'].includes(n));
 for(const name of modifiers)m.key(...KEY[name],true);
 if(modifiers.length)m.run(40000);
 for(const name of names)m.key(...KEY[name],true);
 m.run(160000);m.keys.fill(0);m.run(names.includes('ENTER')?400000:160000);
}
function type(text){
 for(const c of text){
  let names;
  if(c==='\n')names=['ENTER'];else if(c===' ')names=['SPACE'];
  else if(/[a-zA-Z]/.test(c)){const shifted=(c===c.toUpperCase())!==!!(m.lcd.pixels(31)[0]&4);names=shifted?['SHIFT',c.toUpperCase()]:[c.toUpperCase()];}
  else if(symbols[c]){const [key,shift]=symbols[c];names=shift?['SHIFT',key]:[key];}
  else if(KEY[c])names=[c];else throw Error('Unsupported character: '+c);
  tap(names);
  if(c==='\n')assert.doesNotMatch(m.lcd.text().trim(),/^[EW]\d+\b/,'Firmware error after input: '+text);
 }
}
tap(['CLR']);const ready=m.snapshot();
for(const example of library.programs){
 assert(cases[example.id],'Missing execution scenario for '+example.id);
 m.restore(ready);type(example.code+'\n');type('RUN\n');m.run(500000);
 for(const [entry,expected] of cases[example.id]){
  type(entry);m.run(500000);const actual=m.lcd.text().replace(/\s+/g,'');
  if(expected instanceof RegExp)assert.match(actual,expected,example.id);
  else assert.equal(actual,expected,example.id);
 }
 type('\n');m.run(500000);
 assert.doesNotMatch(m.lcd.text().trim(),/^[EW]\d+\b/,example.id+' should finish without an error');
 console.log('PASS '+example.id+' — '+example.title);
}
assert.equal(Object.keys(cases).length,library.programs.length);
console.log('All '+library.programs.length+' library programs executed through the keyboard on real TI-74 firmware.');
