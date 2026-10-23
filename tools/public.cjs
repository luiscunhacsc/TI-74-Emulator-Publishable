'use strict';
// Builds only from firmware-free sources. Never reads the private ROM packages.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),destination=path.join(root,'public');
const check=process.argv.includes('--check');
const romMarker=/<script id="embedded-roms" type="application\/json">([\s\S]*?)<\/script>/;
const coreMarker=/<script id="emulator-core">([\s\S]*?)<\/script>/;
const libraryMarker=/<script id="program-library" type="application\/json">([\s\S]*?)<\/script>/;
const files=['index.html','index.pt-PT.html','README.md','README.pt-PT.md','LICENSE.txt'];
if(fs.existsSync(destination)){
  assert(!fs.lstatSync(destination).isSymbolicLink(),'public must be a real directory');
  for(const entry of fs.readdirSync(destination,{withFileTypes:true}))
    assert(entry.isFile()&&files.includes(entry.name),'Unexpected public file: '+entry.name+'; review it before releasing.');
}
execFileSync(process.execPath,[path.join(__dirname,'localize.cjs'),'--source-only',...(check?['--check']:[])],{stdio:'inherit'});
const read=file=>fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
const content={
  en:{
    source:'index.en-US.html',output:'index.html',other:'index.pt-PT.html',language:'Português',
    description:'Independent pocket BASIC calculator emulator. Offline, with user-supplied ROMs.',
    independent:'INDEPENDENT EMULATOR',load:'Load your ROMs',start:'Start emulator →',
    welcome:'Bring your own ROMs.',
    welcomeText:'No firmware is included. Select your local files to use BASIC, or try the hardware diagnostic without ROMs.',
    policy:'Use only ROMs you are legally entitled to copy and use. For this project, dump the firmware from a calculator you own, only where applicable law permits. Owning the hardware does not automatically authorize downloading copies from the internet. Do not redistribute ROMs without permission.',
    local:'Files are processed locally in your browser and are not uploaded. ROMs, cartridges and character fonts are not supplied or linked for download.',
    compatibility:'Independent emulator of the Texas Instruments TI-74 BASICALC. Not affiliated with, sponsored by, or endorsed by Texas Instruments. These names identify the emulated hardware only; all trademarks belong to their respective owners.',
    firmware:'No manufacturer firmware is included. The software license does not grant rights to ROMs, cartridges or character fonts.',
    reference:'JavaScript adaptation of the BSD-3-Clause portions of MAME. Reference authors: hap, Tim Lindner and Sandro Ronco.',
    library:'Original examples for this emulator, available offline. Each example is a separate program.',
    known:'Known ROM identifiers',internal:'CPU / internal',system:'System',
    identification:'These filenames and CRC32 values identify compatible dumps; they are not download links or proof of permission. Filenames may differ: the loader checks size and checksum.',
    alternate:'Also recognized: system ROM 001060281-1_hn61256pc93.ic1 (32,768 bytes; CRC32 499B69D1). The primary system revision above was used for integration testing.',
    optional:'Optional character font: hd44780_a00.bin (4,096 bytes). It is not needed to run BASIC; an approximate font is built in. The same ROM policy applies.',
    heading:'ROMs and independence',
    replacements:[
      ['TI-74 calculator','Calculator'],['the TI-74','the calculator'],['The TI-74','The calculator'],['your TI-74','your calculator'],
      ['TI-74 SHIFT','Calculator SHIFT'],['TI-74 CTL','Calculator CTL'],['TI-74 memory','calculator memory'],
      ['Send to TI-74','Send to calculator'],['Return to TI-74','Return to calculator'],
      ['TI-74 on','Calculator on'],['TI-74 session resumed.','Calculator session resumed.']
    ]
  },
  pt:{
    source:'index.html',output:'index.pt-PT.html',other:'index.html',language:'English',
    description:'Emulador independente de uma calculadora BASIC de bolso. Offline, com ROMs fornecidas pelo utilizador.',
    independent:'EMULADOR INDEPENDENTE',load:'Carregar as tuas ROMs',start:'Iniciar emulador →',
    welcome:'Usa as tuas próprias ROMs.',
    welcomeText:'Não inclui firmware. Seleciona os teus ficheiros locais para usar BASIC ou experimenta o diagnóstico sem ROMs.',
    policy:'Usa apenas ROMs que tenhas o direito legal de copiar e utilizar. Para este projeto, extrai o firmware de uma calculadora tua, apenas quando a lei aplicável o permitir. Possuir o equipamento não autoriza automaticamente o descarregamento de cópias da Internet. Não redistribuas ROMs sem autorização.',
    local:'Os ficheiros são processados localmente no teu navegador e não são enviados para um servidor. Não são fornecidos ficheiros nem ligações de descarga de ROMs, cartuchos ou fontes de caracteres.',
    compatibility:'Emulador independente da Texas Instruments TI-74 BASICALC. Sem afiliação, patrocínio ou aprovação da Texas Instruments. Estes nomes identificam apenas o equipamento emulado; todas as marcas pertencem aos respetivos titulares.',
    firmware:'Não inclui firmware do fabricante. A licença do software não concede direitos sobre ROMs, cartuchos ou fontes de caracteres.',
    reference:'Adaptação JavaScript das partes BSD-3-Clause do MAME. Autores das referências: hap, Tim Lindner e Sandro Ronco.',
    library:'Exemplos originais para este emulador, disponíveis offline. Cada exemplo é um programa independente.',
    known:'Identificação das ROMs conhecidas',internal:'CPU / interna',system:'Sistema',
    identification:'Estes nomes e valores CRC32 identificam cópias compatíveis; não são ligações de descarga nem prova de autorização. Os nomes podem variar: o carregador verifica o tamanho e a soma de controlo.',
    alternate:'Também reconhecida: ROM de sistema 001060281-1_hn61256pc93.ic1 (32768 bytes; CRC32 499B69D1). A revisão principal acima foi usada nos testes de integração.',
    optional:'Fonte de caracteres opcional: hd44780_a00.bin (4096 bytes). Não é necessária para executar BASIC; existe uma fonte aproximada integrada. Aplica-se a mesma política de ROMs.',
    heading:'ROMs e independência',
    replacements:[
      ['Calculadora TI-74','Calculadora'],['calculadora TI-74','calculadora'],['da tua TI-74','da tua calculadora'],
      ['na TI-74','na calculadora'],['da TI-74','da calculadora'],['à TI-74','à calculadora'],
      ['a TI-74','a calculadora'],['A TI-74','A calculadora'],['TI-74 ligada','Calculadora ligada'],
      ['Sessão TI-74 retomada.','Sessão retomada.']
    ]
  }
};
function replaceOne(text,pattern,replacement){
  assert(pattern.test(text),'Public build source changed: '+pattern);
  return text.replace(pattern,()=>replacement);
}
function build(c){
  let html=read(c.source);
  assert.equal(JSON.parse(html.match(romMarker)?.[1]??'false'),null,'Public source contains firmware');
  const originalCore=html.match(coreMarker)[1];
  // Protect the emulation core and its complete copyright/license notice.
  html=html.replace(coreMarker,'<!-- PUBLIC-CORE -->');
  const library=JSON.parse(html.match(libraryMarker)[1]);
  delete library.reference; // Do not link to third-party copies of manufacturer manuals.
  html=html.replace(libraryMarker,'<!-- PUBLIC-LIBRARY -->');
  html=replaceOne(html,/<meta name="description"[^>]*>/,'<meta name="description" content="'+c.description+'">');
  html=replaceOne(html,/<title>[^<]*<\/title>/,'<title>Pocket BASIC Emulator</title>');
  html=replaceOne(html,/<h1>[^<]*<\/h1>/,'<h1>Pocket BASIC Emulator</h1>');
  html=replaceOne(html,/<header class="topbar">.*?<\/header>/,'<header class="topbar"><div class="brand"><span class="brand-mark" aria-hidden="true">&gt;_</span> POCKET BASIC</div><a href="'+c.other+'" lang="'+(c===content.en?'pt-PT':'en')+'">'+c.language+'</a></header>');
  html=replaceOne(html,/<div class="instrument-brand">.*?<\/div>/,'<div class="instrument-brand"><strong>POCKET BASIC</strong><span class="badge">'+c.independent+'</span></div>');
  html=html.replaceAll('TI-74 BASICALC','Pocket BASIC');
  for(const [before,after] of c.replacements)html=html.split(before).join(after);
  html=replaceOne(html,/(<section class="welcome" id="welcome"><div>)[\s\S]*?<\/div>/,'<section class="welcome" id="welcome"><div><strong>'+c.welcome+'</strong><p>'+c.welcomeText+'</p></div>');
  html=replaceOne(html,/<div class="library-foot">.*?<\/div>/,'<div class="library-foot">'+c.library+'</div>');
  const references='<p>'+c.reference+' <a href="https://github.com/mamedev/mame/blob/master/src/mame/ti/ti74.cpp" target="_blank" rel="noopener">Machine</a> · <a href="https://github.com/mamedev/mame/tree/master/src/devices/cpu/tms7000" target="_blank" rel="noopener">CPU</a> · <a href="https://github.com/mamedev/mame/blob/master/src/devices/video/hd44780.cpp" target="_blank" rel="noopener">LCD</a>.</p><p>'+c.compatibility+'</p><p id="firmware-note">'+c.firmware+'</p>';
  html=replaceOne(html,/<p>[^\n]*<span id="firmware-note">.*?<\/span><\/p>/,references);
  html=replaceOne(html,/<h2 id="rom-title">[^<]*<\/h2>/,'<h2 id="rom-title">'+c.load+'</h2>');
  html=replaceOne(html,/<button id="boot"[^>]*>[^<]*<\/button>/,'<button id="boot" class="primary" disabled>'+c.start+'</button>');
  html=html.replace('c70009.ic2 · 4096 bytes','c70009.ic2 · 4096 bytes · CRC32 55A2F7C0');
  html=html.replace('*.ic1 · 32768 bytes','1060281-101_hn61256pd12.ic1 · 32768 bytes · CRC32 019AAA2F');
  const table='<div class="rom-identifiers"><table><caption>'+c.known+'</caption><thead><tr><th>ROM</th><th>'+(c===content.en?'Filename':'Ficheiro')+'</th><th>Bytes</th><th>CRC32</th></tr></thead><tbody><tr><td>'+c.internal+'</td><td><code>c70009.ic2</code></td><td>4096</td><td>55A2F7C0</td></tr><tr><td>'+c.system+'</td><td><code>1060281-101_hn61256pd12.ic1</code></td><td>32768</td><td>019AAA2F</td></tr></tbody></table></div>';
  html=html.replace('  <footer>','<details class="details" id="rom-policy"><summary>'+c.heading+'</summary><p>'+c.policy+'</p>'+table+'<p>'+c.identification+'</p><p>'+c.alternate+'</p><p>'+c.optional+'</p><p>'+c.local+'</p></details>\n  <footer>');
  html=html.replace('<button type="button" class="dropzone"','<p class="rom-policy">'+c.policy+'</p><p>'+c.local+'</p>\n  <button type="button" class="dropzone"');
  // Separate storage from private editions; exported states remain interoperable.
  html=html.replaceAll('ti74-html-','pocket-basic-public-');
  html=html.replaceAll('ti74-state.json','pocket-basic-state.json').replaceAll('ti74-estado.json','pocket-basic-estado.json').replaceAll('programa-ti74','programa-basic').replaceAll('ti74-program','basic-program');
  html=html.replace('</style>',`/* Public edition: neutral panel, preserving the functional keyboard layout. */
.instrument{background:#303b40;border-radius:10px;box-shadow:0 7px 20px #18252a25;border:1px solid #233139}
.instrument-brand{border-bottom:1px solid #53636a;text-shadow:none}.instrument-brand strong{color:#e1e8e9;font:600 14px system-ui;letter-spacing:1px}
.speaker{background:none}.speaker span{display:none}.device-mode{font:12px var(--mono);letter-spacing:2px;border-bottom:1px solid #53636a}
.rom-identifiers{overflow-x:auto}table{border-collapse:collapse;font-size:12px}caption{text-align:left;font-weight:600;margin:10px 0}th,td{text-align:left;padding:7px 12px 7px 0;border-bottom:1px solid var(--line)}td code{white-space:nowrap}
dialog{max-height:calc(100dvh - 32px);overflow-y:auto}.rom-policy{color:var(--ink);border-left:2px solid var(--green);padding-left:12px}
</style>`);
  html=html.replace('<!-- PUBLIC-LIBRARY -->',()=>'<script id="program-library" type="application/json">'+JSON.stringify(library).replace(/</g,'\\u003c')+'</script>');
  html=html.replace('<!-- PUBLIC-CORE -->',()=>'<script id="emulator-core">'+originalCore+'</script>');
  assert.equal(html.match(coreMarker)[1],originalCore,'Emulation core must be unchanged');
  assert.equal(JSON.parse(html.match(romMarker)[1]),null);
  assert(!/scribd\.com|casio\.ledudu\.com/.test(html),'Unexpected manual mirror link');
  return html;
}
function guide(c){
  const en=c===content.en;
  return '# Pocket BASIC Emulator\n\n'+(en
    ? 'Open **[index.html](index.html)** in Chrome, Edge or Firefox. Português: [index.pt-PT.html](index.pt-PT.html) / [guia](README.pt-PT.md). No installation or server is needed.\n\n'
    : 'Abre **[index.pt-PT.html](index.pt-PT.html)** no Chrome, Edge ou Firefox. English: [index.html](index.html) / [guide](README.md). Não precisa de instalação nem servidor.\n\n')+
    c.compatibility+'\n\n## '+(en?'ROMs you need':'ROMs necessárias')+'\n\n'+c.firmware+' '+c.local+'\n\n'+
    '| ROM | '+(en?'Filename':'Ficheiro')+' | Bytes | CRC32 |\n| --- | --- | ---: | --- |\n'+
    '| '+c.internal+' | `c70009.ic2` | 4096 | `55A2F7C0` |\n| '+c.system+' | `1060281-101_hn61256pd12.ic1` | 32768 | `019AAA2F` |\n\n'+
    c.identification+'\n\n'+c.alternate+'\n\n'+c.optional+'\n\n**'+(en?'ROM policy':'Política de ROMs')+':** '+c.policy+'\n\n## '+(en?'Getting started':'Como começar')+'\n\n'+(en
    ? '1. Click **Load ROMs**, select your two local ROM files, then **Start emulator**. Extract them first if they are in an archive. Remembering ROMs in this browser is optional.\n2. When `W30 Initialized` appears, press **CLR**. In BASIC mode, type `2+2` and press **ENTER**.\n3. Try the 20 built-in examples: **Copy to editor**, **Send to calculator**, wait for **Text entered**, then **RUN** and **ENTER**. **Replace… (NEW)** erases the previous program.\n4. **Save .bas** saves the editor text. **Save state** saves the machine session without ROMs. Keep an exported copy of important programs.\n\nWithout ROMs, **Test hardware** runs the original diagnostic; the example library can still be read and downloaded. The diagnostic does not implement BASIC.\n\n'
    : '1. Usa **Carregar ROMs**, seleciona os dois ficheiros locais e prime **Iniciar emulador**. Extrai-os primeiro se estiverem num arquivo. Guardar as ROMs neste navegador é opcional.\n2. Quando aparecer `W30 Initialized`, prime **CLR**. Em BASIC, escreve `2+2` e prime **ENTER**.\n3. Experimenta os 20 exemplos: **Copiar para o bloco**, **Introduzir na calculadora**, espera pelo fim do envio e prime **RUN** e **ENTER**. **Substituir… (NEW)** apaga o programa anterior.\n4. **Guardar .bas** guarda o texto do editor. **Guardar estado** guarda a sessão sem ROMs. Conserva uma cópia exportada dos programas importantes.\n\nSem ROMs, **Testar hardware** executa o diagnóstico original; podes consultar e descarregar os exemplos. O diagnóstico não implementa BASIC.\n\n')+
    '## '+(en?'License and limits':'Licença e limites')+'\n\n'+c.reference+' '+(en
    ? 'See [LICENSE.txt](LICENSE.txt) and the in-app references. Copyright notices are retained. Manufacturer firmware is excluded from this license.\n\nExperimental compatibility and timing; cassette storage, printers, DOCK-BUS and RAM cartridges are not implemented. Supplied as is, without warranty.\n'
    : 'Consulta [LICENSE.txt](LICENSE.txt) e as referências na aplicação. Os avisos de direitos de autor foram preservados. O firmware do fabricante está excluído desta licença.\n\nCompatibilidade e temporização experimentais; cassete, impressora, DOCK-BUS e cartuchos de RAM não estão implementados. Fornecido tal como está, sem garantia.\n');
}
const outputs={};
for(const c of Object.values(content))outputs[c.output]=build(c);
outputs['README.md']=guide(content.en);outputs['README.pt-PT.md']=guide(content.pt);
outputs['LICENSE.txt']=read('index.html').match(coreMarker)[1].match(/\/\*([\s\S]*?)\*\//)[1].trim()+'\n';
if(!check)fs.mkdirSync(destination,{recursive:true});
for(const [name,data] of Object.entries(outputs)){
  if(check)assert.equal(fs.readFileSync(path.join(destination,name),'utf8'),data,name+' is stale; run node tools/public.cjs');
  else fs.writeFileSync(path.join(destination,name),data,'utf8');
}
console.log((check?'Verified':'Built')+' public edition: '+files.length+' files; no embedded manufacturer firmware.');
