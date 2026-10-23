# TI-74 BASICALC

**Distribuição pública:** usa o [Pocket BASIC Emulator](public/index.pt-PT.html) e o [guia público](public/README.pt-PT.md). Partilha apenas `public/` ou `Pocket-BASIC-Emulator-public.zip`. Os ficheiros `TI-74*.html` descritos abaixo contêm cópias privadas das ROMs e não devem integrar uma distribuição pública. Não publiques esta pasta de trabalho inteira.

Para gerar e verificar o pacote público: `powershell -File tools/release-public.ps1`. O processo usa fontes sem firmware, preserva a licença e inclui apenas cinco ficheiros autorizados. `node tools/public.cjs --check` verifica os ficheiros públicos gerados. As edições privadas permanecem separadas.

**US English:** Open [TI-74.en-US.html](TI-74.en-US.html). See the [English guide](README.en-US.md) for instructions and the translated program library.

Abre **TI-74.html** diretamente no Chrome, Edge ou Firefox. Este ficheiro contém a interface, o emulador e as duas ROMs fornecidas pelo proprietário. Não precisa de servidor, instalação ou ligação à Internet.

No primeiro arranque aparece `W30 Initialized`. Prime **CLR** para começar. O modo inicial é BASIC; **MODE** alterna para CALC. Em BASIC, escreve `2+2` e prime **ENTER**. Em CALC, usa **SHIFT + ENTER** para `=`.

Um toque no teclado físico ou no ecrã introduz um único carácter. Para repetir, mantém a tecla premida durante mais de meio segundo; o início da repetição não depende da velocidade do emulador.

O bloco de programas introduz texto pela matriz de teclado da máquina. Para executar o exemplo, envia as linhas, prime **RUN**, depois **ENTER**, e introduz `S` seguido de **ENTER**: o resultado é **55**. **Guardar .bas** exporta o texto do bloco; **Guardar estado** exporta a memória efetiva da TI-74. O estado automático depende do armazenamento local do navegador; conserva uma cópia exportada dos programas importantes.

## Biblioteca BASIC

O HTML inclui **20 programas originais**, com pesquisa por comando ou tema, código, notas de sintaxe, instruções de execução, resultados esperados e exercícios. A biblioteca funciona offline, mesmo antes de carregar as ROMs.

Escolhe um exemplo e usa **Copiar para o bloco**, depois **Introduzir na TI-74** em modo BASIC. Para os exemplos, a opção **Substituir… (NEW)** fica selecionada: apaga o programa anterior antes de enviar as novas linhas. A cópia para o editor, por si só, não altera a memória da TI-74 e pode ser desfeita com **Restaurar texto anterior**. Depois do envio, prime **RUN** e **ENTER**; cada `PAUSE` espera por ENTER.

O percurso inclui expressões, ciclos, entrada e validação, strings, ASCII, tabelas DATA, estatística, matrizes, GOSUB, subprogramas com parâmetros, trigonometria, formatos IMAGE, números pseudoaleatórios, ordenação, posicionamento no LCD, KEY$ e o método de Newton.

Consulta o [guia da biblioteca](programs/README.md) e os 20 ficheiros `.bas` em `programs/`. Cada exemplo também pode ser descarregado diretamente no emulador.

## Implementação

- `TI-74.html`: artefacto autónomo, com as ROMs fornecidas incorporadas.
- `index.html`: fonte autónoma sem firmware, com seletor de ROMs e diagnóstico original.
- `tools/package.cjs`: incorpora duas ROMs locais na fonte e gera o HTML final.
- `programs/library.json`: catálogo original e código dos 20 exemplos.
- `tools/library.cjs`: gera os `.bas`, o guia e o catálogo incorporado na fonte; `--check` verifica a sincronização.
- `tests/core.test.cjs`: testes do processador, temporizador, interrupções, memória, teclado, LCD e estados.
- `tests/rom-smoke.cjs`: testes de integração com ROMs locais, nunca distribuídas pelos testes.
- `tests/library.test.cjs`: introduz e executa todos os exemplos com firmware real, verificando os resultados.

Código de execução: apenas HTML, CSS e JavaScript. As ROMs originais executam os cálculos e o interpretador BASIC; não há um interpretador BASIC substituto em JavaScript. O diagnóstico é código TMS7000 original e permite testar teclado/LCD sem firmware TI.

## Validação

```powershell
node tests/core.test.cjs
node tests/rom-smoke.cjs 'caminho\c70009.ic2' 'caminho\1060281-101_hn61256pd12.ic1'
node tests/library.test.cjs
node tools/library.cjs --check
```

Após editar `programs/library.json`, regenera os ficheiros e o HTML final:

```powershell
node tools/library.cjs
node tools/package.cjs 'caminho\c70009.ic2' 'caminho\1060281-101_hn61256pd12.ic1'
```

O teste da biblioteca usa por omissão as ROMs já incorporadas em `TI-74.html`; também aceita os dois caminhos de ROMs como argumentos.

ROMs verificadas: CRC32 `55A2F7C0` (CPU, 4096 bytes) e `019AAA2F` (sistema, 32768 bytes). Testes com firmware real cobrem arranque, CALC/BASIC, FOR/NEXT, aritmética, strings, arrays, DATA/READ, GOSUB/RETURN, estados e retenção de RAM em OFF/ON. A interface foi verificada no Chrome através de `file://`, incluindo introdução de programas, exportação, persistência, diagnóstico isolado e disposição móvel.

## Limites conhecidos

Versão experimental. A velocidade 1× usa instruções a 4 MHz / 2; o divisor adicional da memória lenta não está implementado. DOCK-BUS, impressora, cassete e cartuchos de RAM não são emulados. Cartuchos de ROM até 32 KiB são suportados, mas não foram testados com software original. A fonte LCD integrada aproxima os caracteres; o carregador aceita uma ROM HD44780 A00 opcional de 4096 bytes. Não se afirma compatibilidade completa ou temporização exata.

## Referências e licença

Adaptação das partes BSD-3-Clause do MAME: [TI-74](https://github.com/mamedev/mame/blob/master/src/mame/ti/ti74.cpp), [TMS7000](https://github.com/mamedev/mame/tree/master/src/devices/cpu/tms7000) e [HD44780](https://github.com/mamedev/mame/blob/master/src/devices/video/hd44780.cpp). Autores das referências: hap, Tim Lindner e Sandro Ronco. A licença e atribuição completas estão incorporadas em ambos os HTML. A licença do emulador não abrange as ROMs TI. Projeto independente, sem afiliação à Texas Instruments.
