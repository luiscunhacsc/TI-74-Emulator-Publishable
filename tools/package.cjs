'use strict';
// Produces one offline HTML using the owner's supplied ROMs. No network calls.
const fs=require('node:fs');
const path=require('node:path');
const [internalPath,systemPath,output='TI-74.html',sourcePath=path.join(__dirname,'../index.html')]=process.argv.slice(2);
if(!internalPath||!systemPath)throw Error('Usage: node tools/package.cjs <4K CPU ROM> <32K system ROM> [output.html] [source.html]');
const internal=fs.readFileSync(internalPath),system=fs.readFileSync(systemPath);
if(internal.length!==4096||system.length!==32768)throw Error('Invalid ROM lengths (expected 4096 and 32768).');
const data=JSON.stringify({internal:internal.toString('base64'),system:system.toString('base64'),cart:null,font:null});
const source=fs.readFileSync(sourcePath,'utf8');
const marker='<script id="embedded-roms" type="application/json">null</script>';
if(!source.includes(marker))throw Error('Firmware insertion marker is missing.');
fs.writeFileSync(output,source.replace(marker,'<script id="embedded-roms" type="application/json">'+data+'</script>'),'utf8');
console.log('Created '+output+' ('+fs.statSync(output).size+' bytes) with supplied ROMs embedded.');
