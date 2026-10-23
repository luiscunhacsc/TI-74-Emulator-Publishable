'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const english=process.argv.includes('--en-US');
const html=fs.readFileSync(require('node:path').join(__dirname,english?'../index.en-US.html':'../index.html'),'utf8');
vm.runInThisContext(html.match(/<script id="emulator-core">([\s\S]*?)<\/script>/)[1]);
const {TI74,TMS70C46,HD44780,diagnosticROM,crc32}=globalThis.TI74Core;
let passed=0;
function test(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){console.error('FAIL '+name);throw e;}}
test('Original diagnostic executes on the CPU and scans the keyboard',()=>{
 const m=new TI74(), rom=diagnosticROM();m.load(rom.internal,rom.system,'diagnostic');m.run(100000);
 console.log('Diagnostic display:',JSON.stringify(m.lcd.text()));
 assert.match(m.lcd.text(),english?/TI-74  DIAGNOSTIC   KEY:/:/TI-74  DIAGNOSTICO/);
 m.key(6,32,true);m.run(10000);assert.equal(m.lcd.text().slice(28),'620');
 m.key(6,32,false);m.key(7,128,true);m.run(10000);assert.equal(m.lcd.text().slice(28),'780');
});
function fixture(program=[]){
 const mem=new Uint8Array(65536);mem.set(program,0x200);
 const bus={read:a=>mem[a&65535],write:(a,v)=>{mem[a&65535]=v;}};
 const cpu=new TMS70C46(bus);cpu.pc=0x200;cpu.sp=0x50;cpu.irq1=false;return {cpu,mem};
}
test('ADC/SBB signed result, carry and borrow over every byte pair',()=>{
 const {cpu,mem}=fixture();
 for(let a=0;a<256;a++)for(let b=0;b<256;b++)for(let carry=0;carry<=1;carry++){
   mem[0]=a;mem[0x200]=0x29;mem[0x201]=b;cpu.pc=0x200;cpu.sr=carry?128:0;cpu.step();
   let n=a+b+carry;assert.equal(mem[0],n%256);assert.equal(!!(cpu.sr&128),n>255);assert.equal(!!(cpu.sr&32),n%256===0);assert.equal(!!(cpu.sr&64),n%256>=128);
   mem[0]=a;mem[0x200]=0x2b;cpu.pc=0x200;cpu.sr=carry?128:0;cpu.step();
   n=a-b-(1-carry);assert.equal(mem[0],(n+256)%256);assert.equal(!!(cpu.sr&128),n>=0);
 }
});
test('Decimal addition/subtraction covers all valid BCD operands',()=>{
 const {cpu,mem}=fixture(),bcd=n=>Math.floor(n/10)*16+n%10;
 for(let a=0;a<100;a++)for(let b=0;b<100;b++)for(let c=0;c<2;c++){
   mem[0]=bcd(a);mem[0x200]=0x2e;mem[0x201]=bcd(b);cpu.pc=0x200;cpu.sr=c*128;cpu.step();
   assert.equal(mem[0],bcd((a+b+c)%100));assert.equal(!!(cpu.sr&128),a+b+c>=100);
   mem[0]=bcd(a);mem[0x200]=0x2f;cpu.pc=0x200;cpu.sr=c*128;cpu.step();
   const n=a-b-(1-c);assert.equal(mem[0],bcd((n+100)%100));assert.equal(!!(cpu.sr&128),n>=0);
 }
});
test('Operand modes, multiply and big-endian register pairs',()=>{
 const {cpu,mem}=fixture([0x72,13,0x20,0x12,0x20,0x52,7,0x6c,0x88,0x12,0x34,0x30]);
 cpu.step();assert.equal(mem[0x20],13);cpu.step();cpu.step();cpu.step();
 assert.equal(mem[0],0);assert.equal(mem[1],91);cpu.step();assert.equal(mem[0x2f],0x12);assert.equal(mem[0x30],0x34);
});
test('Call, return, stack wrap and reset vector',()=>{
 const {cpu,mem}=fixture([0x8e,0x03,0x00]);mem[0x300]=0x0a;
 cpu.step();assert.equal(cpu.pc,0x300);assert.equal(mem[0x51],2);assert.equal(mem[0x52],3);
 cpu.step();assert.equal(cpu.pc,0x203);assert.equal(cpu.sp,0x50);
 cpu.sp=255;cpu.pushWord(0xabcd);assert.equal(cpu.sp,1);assert.equal(cpu.popWord(),0xabcd);
 mem[65534]=0x42;mem[65535]=0x10;cpu.reset();assert.equal(cpu.pc,0x4210);assert.equal(cpu.sp,1);
});
test('Signed branches wrap PC; JGE uses N, and DJNZ preserves flags',()=>{
 let {cpu,mem}=fixture([0xe5,0x80]);cpu.sr=32;cpu.step();assert.equal(cpu.pc,0x182);
 cpu.pc=0x200;cpu.sr=64;cpu.step();assert.equal(cpu.pc,0x202);
 cpu.pc=0xffff;mem[65535]=0xe0;mem[0]=0xfe;cpu.step();assert.equal(cpu.pc,0xffff);
 ({cpu,mem}=fixture([0xba,0xfe]));mem[0]=2;cpu.sr=192;cpu.step();assert.equal(mem[0],1);assert.equal(cpu.pc,0x200);assert.equal(cpu.sr,192);
 cpu.step();assert.equal(mem[0],0);assert.equal(cpu.pc,0x202);
});
test('Rotate carry, compare non-writeback and double decrement',()=>{
 const {cpu,mem}=fixture([0xbd,0x2d,128,0xdb,0x20]);mem[0]=1;cpu.sr=128;cpu.step();assert.equal(mem[0],128);assert.equal(cpu.sr&192,192);
 cpu.step();assert.equal(mem[0],128);assert.equal(cpu.sr&160,160);
 mem[0x1f]=1;mem[0x20]=0;cpu.step();assert.equal(mem[0x1f],0);assert.equal(mem[0x20],255);
});
test('Timer interrupt wakes IDLE, stacks PC/ST and RETI resumes',()=>{
 const {cpu,mem}=fixture([0x01,0x00]);cpu.io=4;cpu.sr=16;
 cpu.writePort(2,0);cpu.writePort(3,128);mem[0xfffa]=3;mem[0xfffb]=0;mem[0x300]=0x0b;
 cpu.step();assert.equal(cpu.idle,true);cpu.step();assert.equal(cpu.io&8,8);
 cpu.writePort(3,0);cpu.io|=8;cpu.step();assert.equal(cpu.idle,false);assert.equal(cpu.pc,0x201);assert.equal(cpu.sr,16);assert.equal(cpu.sp,0x50);
});
test('All documented opcode slots decode, undefined slots trap explicitly',()=>{
 const valid=new Set([0,1,5,6,7,8,9,10,11,13,14,128,145]);
 for(let h=1;h<=7;h++)for(let l=2;l<16;l++)valid.add(h*16+l);
 for(let h=8;h<=10;h++)for(const l of [2,3,4,5,6,7,8,10,11,12,13,14])valid.add(h*16+l);
 for(let op=176;op<256;op++)valid.add(op);
 for(let op=0;op<256;op++){const {cpu}=fixture([op,0,0]);if(valid.has(op))assert.doesNotThrow(()=>cpu.step(),'Opcode '+op.toString(16));else assert.throws(()=>cpu.step(),english?/Undefined instruction/:/Instrução não definida/);}
});
test('Bank switching, internal ROM, cartridge and read-only memory',()=>{
 const m=new TI74();m.system.forEach((_,i)=>m.system[i]=i>>>13);m.internal[0]=0x55;
 for(let b=0;b<4;b++){m.write(0x106,b|4);assert.equal(m.read(0xc000),b);assert.equal(m.read(0xdfff),b);}
 m.write(0xf000,0);assert.equal(m.read(0xf000),0x55);m.write(0x2000,77);assert.equal(m.read(0x2000),77);
 assert.equal(m.read(0x4000),255);m.cart=new Uint8Array(32768).fill(42);assert.equal(m.read(0x4000),42);m.write(0x4000,1);assert.equal(m.read(0x4000),42);
});
test('Keyboard matrix selects rows and port E respects external bus enable',()=>{
 const m=new TI74();for(let r=0;r<8;r++){m.keys.fill(0);m.key(r,1<<r,true);m.cpu.writePort(24,0);m.cpu.writePort(12,1<<r);assert.equal(m.cpu.readPort(4),1<<r);m.cpu.writePort(12,255^(1<<r));assert.equal(m.cpu.readPort(4),0);}
 m.cpu.writePort(24,32);assert.equal(m.select,255);m.cpu.writePort(12,0);assert.equal(m.select,255);
});
test('LCD commands, busy flag, row discontinuity, CGRAM and visible 31 cells',()=>{
 const lcd=new HD44780();lcd.write(0,0x38);lcd.write(0,0x0c);lcd.write(0,0x06);lcd.write(0,0x80);lcd.write(1,65);
 assert.equal(lcd.text()[0],'A');assert.equal(lcd.read(0)&128,128);lcd.tick(100);assert.equal(lcd.read(0)&128,0);
 lcd.write(0,0xa7);lcd.write(1,66);assert.equal(lcd.ac,64);lcd.write(1,67);assert.equal(lcd.text()[16],'C');
 lcd.write(0,0x40);lcd.write(1,31);lcd.write(0,0x80);lcd.write(1,0);assert.equal(lcd.pixels(0)[0],31);
 lcd.write(0,0x01);assert.equal(lcd.text().trim(),'');assert.equal(lcd.busy,3038);
});
test('LCD 4-bit interface and decrement mode',()=>{
 const lcd=new HD44780();lcd.write(0,0x28);lcd.write(0,0x00);lcd.write(0,0xc0);lcd.write(0,0x00);lcd.write(0,0x60);lcd.write(1,0x40);lcd.write(1,0x10);
 assert.equal(lcd.text()[0],'A');lcd.write(0,0x00);lcd.write(0,0x40);lcd.write(0,0xc0);lcd.write(0,0x00);lcd.write(1,0x40);lcd.write(1,0x20);assert.equal(lcd.ac,39);
});
test('Snapshots validate atomically and cannot overwrite unrelated firmware',()=>{
 const m=new TI74(),r=diagnosticROM();m.load(r.internal,r.system,'diagnostic');m.run(10000);const s=m.snapshot();
 m.ram[44]=93;m.restore(s);assert.equal(m.ram[44],0);assert.equal(m.cpu.pc,s.cpu.pc);
 for(const mutate of [v=>v.firmware='bad',v=>v.cpu.pc=-1,v=>v.ram.pop(),v=>v.cpu.timerPhase=Infinity,v=>v.lcd.direction=0]){
   const bad=structuredClone(s);mutate(bad);assert.throws(()=>m.restore(bad));assert.deepEqual(m.snapshot(),s);
 }
});
test('Known CRC32 vector',()=>assert.equal(crc32(Buffer.from('123456789')),'CBF43926'));
console.log(passed+' test groups passed.');
module.exports={TI74,TMS70C46,HD44780,diagnosticROM,crc32};
