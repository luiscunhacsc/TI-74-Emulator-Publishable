'use strict';
// Local firmware is supplied as command line arguments; never copied into the app.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {TI74,crc32}=require('./core.test.cjs');
const [cpuFile,systemFile]=process.argv.slice(2);
if(!cpuFile||!systemFile)throw Error('Usage: node tests/rom-smoke.cjs <cpu-rom> <system-rom>');
const internal=fs.readFileSync(cpuFile),system=fs.readFileSync(systemFile);
console.log('ROM CRC32',crc32(internal),crc32(system));
const m=new TI74();m.load(internal,system);
m.run(2000000);assert.match(m.lcd.text(),/W30 Initialized/);
function tap(row,bit,shift=false){
 if(shift)m.key(7,128,true);
 m.key(row,bit,true);m.run(180000);m.key(row,bit,false);m.key(7,128,false);m.run(180000);
}
tap(3,4); // CLR
tap(5,2); // 2
tap(7,1); // +
tap(5,2); // 2
tap(3,1); // ENTER
tap(5,16); // MODE
tap(3,4); // CLR
tap(5,2);tap(7,1);tap(5,2);tap(3,1,true); // 2+2 =
assert.match(m.lcd.text(),/4\s+=/);
tap(5,16);tap(3,4); // BASIC, CLR
const html=fs.readFileSync('index.html','utf8');
const keyDefs=html.slice(html.indexOf('const KEY='),html.indexOf('let machine=new TI74()'));
const {KEY,symbols}=vm.runInNewContext(keyDefs+';({KEY,symbols})');
function type(text){
 for(const c of text){
   let name=c,shift=false;
   if(c==='\n')name='ENTER';else if(c===' ')name='SPACE';
   else if(/[a-zA-Z]/.test(c)){name=c.toUpperCase();shift=(c===name)!==!!(m.lcd.pixels(31)[0]&4);}
   else if(symbols[c])[name,shift]=symbols[c];
   const [row,bit]=KEY[name];
   if(shift)m.key(7,128,true);m.key(row,bit,true);m.run(160000);
   m.key(row,bit,false);m.key(7,128,false);m.run(c==='\n'?400000:160000);
 }
 console.log('TYPED',JSON.stringify(text),'DISPLAY',JSON.stringify(m.lcd.text()));
}
type('NEW\n10 S=0\n20 FOR I=1 TO 10\n30 S=S+I\n40 NEXT I\n50 PRINT S\n60 END\nRUN\nS\n');
assert.match(m.lcd.text(),/55/);
const state=m.snapshot();const next=new TI74();next.load(internal,system);next.restore(JSON.parse(JSON.stringify(state)));next.run(100000);
assert.equal(next.lcd.text(),m.lcd.text());
tap(6,16);m.run(3000000);console.log('OFF',m.power,m.cpu.pc.toString(16));assert.equal(m.power,false);m.turnOn();m.run(500000);tap(3,4);type('RUN\nS\n');assert.match(m.lcd.text(),/55/);
tap(3,4);type('SQR(81)\n');assert.equal(m.lcd.text().trim(),'9');
tap(3,4);type('LEN("HELLO")\n');assert.equal(m.lcd.text().trim(),'5');
tap(3,4);type('NEW\n10 DIM A(3)\n20 DATA 2,3,4\n30 FOR I=1 TO 3\n40 READ A(I)\n50 NEXT I\n60 GOSUB 100\n70 END\n100 T=A(1)*A(2)*A(3)\n110 RETURN\nRUN\nT\n');assert.equal(m.lcd.text().trim(),'24');
tap(3,4);m.key(7,32,true);tap(6,32);m.key(7,32,false);m.run(200000);assert.match(m.lcd.text(),/SIN\(/);
console.log('REAL ROM PASS: boot, CALC/BASIC, FOR/NEXT, SQR, strings, DIM/DATA/READ, GOSUB/RETURN, FN, snapshot, OFF/ON RAM.');

// Exercise the UI's real input scheduler with a deterministic host clock and real ROMs.
// DOM rendering is covered separately by the browser checks.
let now=0;
const inputContext=vm.createContext({TI74,performance:{now:()=>now},
 document:{querySelector:()=>({focus(){}}),querySelectorAll:()=>[]},advanceTyping(){}});
const inputSetup=html.slice(html.indexOf('const KEY='),html.indexOf('const indicatorMap='));
const inputFunctions=html.slice(html.indexOf('function notice('),html.indexOf('function physical('));
const inputRunner=html.slice(html.indexOf('function runInput('),html.indexOf('function frame('));
const input=vm.runInContext(inputSetup+inputFunctions+inputRunner+';({machine,press,release,releaseAll,runInput,repeatKeys})',inputContext);
input.machine.load(internal,system);input.machine.run(2000000);
input.press('clear',['CLR']);input.release('clear');input.runInput(400000);
const ready=input.machine.snapshot(),screen=()=>input.machine.lcd.text().trim();
function resetInput(){input.releaseAll();input.machine.restore(ready);now=0;}
function advanceHost(ms,speed=1,frameMs=16){
 for(let elapsed=0;elapsed<ms;){const step=Math.min(frameMs,ms-elapsed);elapsed+=step;now+=step;input.repeatKeys(now);input.runInput(step*2000*speed);}
}
for(const speed of [0.25,0.5,1,2,4]){
 resetInput();
 input.press('one',['1']);advanceHost(150,speed);input.release('one');
 input.press('zero',['0']);advanceHost(250,speed);input.release('zero');advanceHost(1000,speed);
 assert.equal(screen(),'10','ordinary taps at '+speed+'x');
 resetInput();for(const c of '10000'){input.press('tap',[c]);input.release('tap');}
 advanceHost(2500,speed);assert.equal(screen(),'10000','rapid taps, including the same key, at '+speed+'x');
 resetInput();input.press('hold',['0']);advanceHost(450,speed);assert.equal(screen(),'0','hold delay at '+speed+'x');
 advanceHost(450,speed);input.release('hold');advanceHost(700,speed);assert.match(screen(),/^0{2,5}$/);
 const afterRelease=screen();advanceHost(700,speed);assert.equal(screen(),afterRelease,'release stops repeats');
}
resetInput();for(const c of '10000'){input.press('tap',[c]);input.release('tap');}
advanceHost(500,4,50);assert.equal(screen(),'10000','50 ms frames at 4x must not extend matrix pulses');
// This scan position previously read the digit before noticing its Shift modifier.
resetInput();input.machine.run(102422);input.press('quote',['SHIFT','2'],true);input.release('quote');
advanceHost(500);assert.equal(screen(),'"');
resetInput();input.press('shift',['SHIFT']);input.press('quote',['SHIFT','2'],true);input.release('quote');input.release('shift');
advanceHost(500);assert.equal(screen(),'"','quick modifier chord survives release');
resetInput();input.press('hold',['0']);advanceHost(200);input.releaseAll();advanceHost(1000);assert.equal(screen(),'0','blur clears held keys');
console.log('INPUT PASS: single taps, rapid repeated digits, delayed holds at every speed, slow frames, modifiers and blur.');
