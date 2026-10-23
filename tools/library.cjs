'use strict';
// library.json is the source for the offline catalogue, .bas files and learning guide.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),check=process.argv.includes('--check');
const library=JSON.parse(fs.readFileSync(path.join(root,'programs/library.json'),'utf8'));
const ids=new Set();
for(const item of library.programs){
 assert.match(item.id,/^\d{2}-[a-z0-9-]+$/);assert(!ids.has(item.id),'Duplicate example');ids.add(item.id);
 for(const field of ['title','category','level','summary','instructions','expected','experiment','code'])assert.equal(typeof item[field],'string',item.id+': '+field);
 assert(item.concepts.length&&item.notes.length,item.id+': missing teaching notes');
 let previous=0;
 for(const line of item.code.split('\n')){
  assert.match(line,/^[1-9]\d* [\x20-\x7e]+$/,item.id+': invalid BASIC line');
  const number=Number(line.split(' ')[0]);assert(number>previous&&number<32767,item.id+': line order');previous=number;
  assert(line.length<=80,item.id+': line exceeds the TI-74 input limit');
 }
}
function output(relative,content){
 const file=path.join(root,relative);
 if(check)assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),content.replace(/\r\n/g,'\n'),relative+' is stale; run node tools/library.cjs');
 else fs.writeFileSync(file,content,'utf8');
}
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const marker=/<script id="program-library" type="application\/json">[\s\S]*?<\/script>/;
assert(marker.test(source),'Missing library marker');
const embedded='<script id="program-library" type="application/json">'+JSON.stringify(library).replace(/</g,'\\u003c')+'</script>';
output('index.html',source.replace(marker,()=>embedded));
for(const item of library.programs)output('programs/'+item.id+'.bas',item.code+'\n');
let guide=`# Biblioteca de programas TI-74\n\n${library.programs.length} exemplos originais, do primeiro programa a subprogramas com parâmetros. Os ficheiros usam apenas caracteres ASCII compatíveis com o teclado da TI-74.\n\n`;
guide+='## Como experimentar\n\n1. Abre `TI-74.html` e seleciona o modo BASIC.\n2. Na **Biblioteca BASIC**, procura um tema ou comando e escolhe um exemplo.\n3. **Copiar para o bloco** coloca o código no editor. Podes restaurar o texto anterior.\n4. **Introduzir na TI-74** envia as linhas. A opção **Substituir… (NEW)**, selecionada para exemplos, apaga o programa anterior; exporta o estado primeiro se o quiseres guardar.\n5. Espera pela mensagem **Texto introduzido**, prime **RUN** e depois **ENTER**. Segue as instruções de cada exemplo.\n\n';
guide+='O código é introduzido pelo teclado emulado: a velocidade 4× reduz a espera. `PRINT` seguido de `PAUSE` mantém cada resultado legível; prime ENTER para continuar. Usa BREAK para interromper. Os exemplos são independentes: abre um de cada vez. O editor e os downloads funcionam mesmo sem ROMs; executar requer as ROMs TI.\n\n';
guide+='## Percurso\n\n| Programa | Tema | Nível | Sintaxe |\n| --- | --- | --- | --- |\n';
for(const item of library.programs)guide+=`| [${item.title}](${item.id}.bas) | ${item.category} | ${item.level} | ${item.concepts.map(v=>'`'+v+'`').join(', ')} |\n`;
for(const item of library.programs){
 guide+=`\n## ${item.id.slice(0,2)} · ${item.title}\n\n${item.summary}\n\n[Descarregar o programa](${item.id}.bas)\n\n**Executar:** ${item.instructions}\n\n**Resultado esperado:** ${item.expected}\n\n`;
 guide+=item.notes.map(note=>'- '+note).join('\n')+`\n\n**Experimenta:** ${item.experiment}\n`;
}
guide+='\n## Manutenção e verificação\n\nEdita `programs/library.json` e executa `node tools/library.cjs` para atualizar os `.bas`, este guia e o catálogo incorporado em `index.html`. `node tools/library.cjs --check` verifica a sincronização sem escrever. Depois, volta a gerar `TI-74.html` com `tools/package.cjs`.\n\n';
guide+='`node tests/library.test.cjs` carrega as ROMs de `TI-74.html` e introduz todos os programas pela matriz de teclado, verificando perguntas, resultados e conclusão. Também aceita os caminhos de duas ROMs locais como argumentos. Os testes não incluem cópias de firmware.\n\n';
guide+=`Referência consultada: [Texas Instruments, TI-74 Programming Reference Guide](${library.reference}). Os programas e as explicações desta biblioteca são originais e foram verificados no emulador; não são transcrições dos exemplos do manual.\n`;
guide+='\nEsta seleção demonstra funcionalidades disponíveis neste emulador. Não inclui exemplos de cassete, impressora, DOCK-BUS ou cartuchos de RAM, que não estão implementados.\n';
output('programs/README.md',guide);
console.log((check?'Verified':'Generated')+' '+library.programs.length+' examples, offline catalogue and learning guide.');
