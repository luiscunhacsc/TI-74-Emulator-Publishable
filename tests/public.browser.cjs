'use strict';
// Optional local smoke test. Private firmware is read into memory, never written to public/.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(__dirname,'../.qa'),__dirname]}));
const root=path.join(__dirname,'..');
const packed=fs.readFileSync(path.join(root,'TI-74.html'),'utf8');
const roms=JSON.parse(packed.match(/<script id="embedded-roms"[^>]*>([\s\S]*?)<\/script>/)[1]);
const files=[['c70009.ic2',roms.internal],['1060281-101_hn61256pd12.ic1',roms.system]].map(([name,data])=>({name,mimeType:'application/octet-stream',buffer:Buffer.from(data,'base64')}));
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try{
    for(const [name,locale] of [['index.html','en-US'],['index.pt-PT.html','pt-PT']]){
      const context=await browser.newContext({viewport:{width:1440,height:1050},offline:true});
      const page=await context.newPage(),errors=[],network=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
      await page.goto(pathToFileURL(path.join(root,'public',name)).href);
      assert.equal(await page.title(),'Pocket BASIC Emulator');
      assert.equal(await page.evaluate(()=>TI74App.machine.kind),'empty');
      assert.equal(await page.isVisible('#welcome'),true);
      assert.equal(await page.locator('#library-list button').count(),20);
      await page.click('#open-roms');
      assert.match(await page.textContent('#pending-system'),/1060281-101_hn61256pd12.ic1.*019AAA2F/);
      assert.equal(await page.isChecked('#remember'),false);
      assert.equal(await page.isDisabled('#boot'),true);
      await page.click('#close-roms');
      await page.click('#diagnostic');
      await page.waitForFunction(()=>TI74App.machine.lcd.text().includes('DIAGNOSTIC'));
      // The functional layout and scrollable ROM dialog must fit a phone viewport.
      await page.setViewportSize({width:390,height:844});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await page.click('#open-roms');
      assert.equal(await page.evaluate(()=>{
        const box=document.getElementById('rom-dialog').getBoundingClientRect();
        return box.left>=0&&box.right<=innerWidth&&box.top>=0&&box.bottom<=innerHeight;
      }),true);
      await page.screenshot({path:path.join(root,'.qa','public-'+locale+'-roms-mobile.png')});
      await page.setInputFiles('#rom-files',files);
      assert.equal(await page.isDisabled('#boot'),false);
      await page.click('#boot');
      await page.waitForFunction(()=>TI74App.machine.lcd.text().includes('W30 Initialized'));
      assert.equal(await page.evaluate(()=>TI74App.machine.fingerprint),'55A2F7C0-019AAA2F');
      await page.setViewportSize({width:1440,height:1050});
      for(const key of ['F3','2','+','2','Enter']){await page.keyboard.press(key);await page.waitForTimeout(220);}
      assert.equal((await page.evaluate(()=>TI74App.machine.lcd.text())).trim(),'4');
      await page.keyboard.press('F3');await page.waitForTimeout(220);
      await page.selectOption('#speed','4');await page.click('#send-program');
      await page.waitForFunction(()=>!document.getElementById('stop-typing').hidden);
      await page.waitForFunction(()=>document.getElementById('stop-typing').hidden,{},{timeout:20000});
      for(const key of ['F4','Enter','s','Enter']){await page.keyboard.press(key);await page.waitForTimeout(250);}
      assert.equal((await page.evaluate(()=>TI74App.machine.lcd.text())).trim(),'55');
      // No ROM persistence without opt-in; reload returns to the empty loader.
      await page.reload();assert.equal(await page.evaluate(()=>TI74App.machine.kind),'empty');
      await page.click('#open-roms');await page.setInputFiles('#rom-files',files);await page.check('#remember');await page.click('#boot');
      await page.waitForFunction(()=>TI74App.machine.kind==='rom');
      await page.reload();await page.waitForFunction(()=>TI74App.machine.kind==='rom');
      const keys=await page.evaluate(()=>Object.keys(localStorage));
      assert(keys.some(key=>key.startsWith('pocket-basic-public-firmware-')));
      assert(keys.every(key=>!key.startsWith('ti74-html-')));
      await page.click('#forget');await page.reload();
      assert.equal(await page.evaluate(()=>TI74App.machine.kind),'empty');
      await page.screenshot({path:path.join(root,'.qa','public-'+locale+'-desktop.png'),fullPage:true});
      assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
      await context.close();
      console.log('PASS '+locale+': offline startup, diagnostic, mobile loader, real ROM boot, arithmetic, BASIC program, optional persistence and forget');
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
