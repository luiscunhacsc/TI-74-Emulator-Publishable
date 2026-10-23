# Biblioteca de programas TI-74

20 exemplos originais, do primeiro programa a subprogramas com parâmetros. Os ficheiros usam apenas caracteres ASCII compatíveis com o teclado da TI-74.

## Como experimentar

1. Abre `TI-74.html` e seleciona o modo BASIC.
2. Na **Biblioteca BASIC**, procura um tema ou comando e escolhe um exemplo.
3. **Copiar para o bloco** coloca o código no editor. Podes restaurar o texto anterior.
4. **Introduzir na TI-74** envia as linhas. A opção **Substituir… (NEW)**, selecionada para exemplos, apaga o programa anterior; exporta o estado primeiro se o quiseres guardar.
5. Espera pela mensagem **Texto introduzido**, prime **RUN** e depois **ENTER**. Segue as instruções de cada exemplo.

O código é introduzido pelo teclado emulado: a velocidade 4× reduz a espera. `PRINT` seguido de `PAUSE` mantém cada resultado legível; prime ENTER para continuar. Usa BREAK para interromper. Os exemplos são independentes: abre um de cada vez. O editor e os downloads funcionam mesmo sem ROMs; executar requer as ROMs TI.

## Percurso

| Programa | Tema | Nível | Sintaxe |
| --- | --- | --- | --- |
| [Olá, TI-74](01-hello.bas) | Primeiros passos | Inicial | `REM`, `PRINT`, `PAUSE`, `END`, `:` |
| [Expressões e prioridades](02-arithmetic.bas) | Primeiros passos | Inicial | `LET`, `+`, `*`, `^`, `SQR`, `()` |
| [Somar de 1 a 10](03-sum.bas) | Primeiros passos | Inicial | `FOR`, `TO`, `NEXT`, `variáveis` |
| [Contagem decrescente](04-countdown.bas) | Primeiros passos | Inicial | `FOR`, `STEP`, `NEXT`, `PAUSE` |
| [Conversor de temperatura](05-temperature.bas) | Entrada e decisões | Inicial | `INPUT`, `variáveis`, `expressões` |
| [Validar e decidir: par ou ímpar](06-decisions.bas) | Entrada e decisões | Intermédio | `IF`, `THEN`, `ELSE`, `OR`, `INT`, `GOTO` |
| [Cortar, juntar e procurar texto](07-strings.bas) | Texto | Intermédio | `$`, `&`, `SEG$`, `LEN`, `POS` |
| [Entre texto, códigos e números](08-ascii.bas) | Texto | Intermédio | `ASC`, `CHR$`, `VAL`, `STR$`, `&` |
| [Ler e reler uma tabela](09-data.bas) | Dados e algoritmos | Inicial | `DATA`, `READ`, `RESTORE`, `FOR` |
| [Média e desvio padrão](10-statistics.bas) | Dados e algoritmos | Intermédio | `DIM`, `READ`, `FOR`, `SQR`, `^` |
| [Uma matriz 2 × 2](11-matrix.bas) | Dados e algoritmos | Intermédio | `DIM`, `FOR`, `NEXT`, `DATA`, `índices` |
| [Reutilizar uma sub-rotina](12-gosub.bas) | Estrutura | Intermédio | `GOSUB`, `RETURN`, `GOTO`, `SQR` |
| [Subprograma com parâmetros](13-subprogram.bas) | Estrutura | Avançado | `CALL`, `SUB`, `SUBEND`, `parâmetros` |
| [Ângulos e logaritmos](14-science.bas) | Ciência | Intermédio | `DEG`, `RAD`, `SIN`, `PI`, `LOG`, `LN`, `EXP` |
| [Formatar números](15-formatting.bas) | Visor e interação | Intermédio | `IMAGE`, `PRINT USING`, `casas decimais` |
| [Lançar dois dados](16-dice.bas) | Ciência | Intermédio | `RANDOMIZE`, `RND`, `INT` |
| [Ordenar cinco valores](17-sorting.bas) | Dados e algoritmos | Avançado | `DIM`, `FOR`, `IF`, `THEN`, `troca` |
| [Posicionar texto no LCD](18-display.bas) | Visor e interação | Intermédio | `DISPLAY`, `AT`, `ERASE ALL`, `RPT$`, `;` |
| [Ler uma tecla sem ENTER](19-keyboard.bas) | Visor e interação | Intermédio | `KEY$`, `ASC`, `PRINT` |
| [Aproximar uma raiz](20-newton.bas) | Ciência | Avançado | `INPUT`, `ABS`, `IF`, `GOTO`, `iteração` |

## 01 · Olá, TI-74

O primeiro programa: escrever uma mensagem e mantê-la no visor.

[Descarregar o programa](01-hello.bas)

**Executar:** Prime RUN e ENTER. Lê a mensagem; ENTER termina a pausa.

**Resultado esperado:** OLA, TI-74!

- 10 é um comentário; não produz saída.
- 20 reúne PRINT e PAUSE na mesma linha, separados por dois-pontos.
- PAUSE permite ler o resultado antes de continuar.

**Experimenta:** Muda o texto entre aspas. Usa até 31 caracteres para caber no visor.

## 02 · Expressões e prioridades

Compara operações com e sem parênteses e combina potências com raízes.

[Descarregar o programa](02-arithmetic.bas)

**Executar:** RUN e ENTER. Prime ENTER entre os dois ecrãs e no final.

**Resultado esperado:** Primeiro: A=14 e B=20. Depois: C=41.

- 20 usa LET; nas linhas seguintes a atribuição dispensa essa palavra.
- A multiplica antes de somar. B força a soma com parênteses.
- C combina 2 elevado a 5 com a raiz de 81.

**Experimenta:** Troca 2^5 por 2^8 e prevê o novo C antes de executar.

## 03 · Somar de 1 a 10

Um contador e um acumulador mostram a estrutura de um ciclo.

[Descarregar o programa](03-sum.bas)

**Executar:** RUN e ENTER. O total fica visível até premires ENTER.

**Resultado esperado:** SOMA=55

- 20 inicializa S antes do ciclo.
- 30–50 visitam os valores de I entre 1 e 10 e acumulam-nos em S.
- Depois de terminar, escreve S e ENTER para consultar a variável.

**Experimenta:** Muda o limite para 100. O total deve passar a 5050.

## 04 · Contagem decrescente

Um incremento negativo percorre um ciclo em ordem inversa.

[Descarregar o programa](04-countdown.bas)

**Executar:** RUN e ENTER. Prime ENTER para passar por 3, 2, 1 e PARTIDA.

**Resultado esperado:** 3 → 2 → 1 → PARTIDA

- 20 usa STEP -1 para diminuir o contador.
- A pausa está dentro do ciclo: cada número espera por ENTER.

**Experimenta:** Começa em 10 e usa STEP -2. Que valores aparecem?

## 05 · Conversor de temperatura

Pede um valor ao utilizador e calcula uma transformação.

[Descarregar o programa](05-temperature.bas)

**Executar:** RUN e ENTER. Em CELSIUS? escreve 25 e ENTER. ENTER fecha o resultado.

**Resultado esperado:** Com 25: F=77. Com -40: F=-40.

- 20 apresenta uma pergunta e guarda a resposta em C.
- 30 aplica F=C×9/5+32; o ponto é o separador decimal.

**Experimenta:** Converte no sentido inverso: pede F e calcula (F-32)*5/9.

## 06 · Validar e decidir: par ou ímpar

Valida um inteiro e escolhe uma de duas respostas.

[Descarregar o programa](06-decisions.bas)

**Executar:** RUN e ENTER. Introduz um inteiro entre 0 e 100. Testa também -1 ou 2.5; ENTER permite tentar novamente.

**Resultado esperado:** 7 → IMPAR; 8 → PAR. Valores fora do domínio mostram INTEIRO DE 0 A 100.

- 30 rejeita negativos, valores acima de 100 e números com parte decimal.
- 40 compara N com o dobro da sua metade inteira.
- GOTO 20 volta à pergunta após uma entrada inválida.

**Experimenta:** Altera o teste para identificar múltiplos de 3.

## 07 · Cortar, juntar e procurar texto

Explora as operações de texto próprias deste BASIC.

[Descarregar o programa](07-strings.bas)

**Executar:** RUN e ENTER. ENTER avança entre os dois resultados.

**Resultado esperado:** BASIC / ALC; depois LEN=8 e POS=5.

- A$ e B$ são variáveis de texto.
- 30 constrói B$ com duas partes de A$ e o operador &.
- 50 mede o texto e procura CAL a partir da posição 1.

**Experimenta:** Muda BASICALC para CALCULADORA e adapta os cortes.

## 08 · Entre texto, códigos e números

Converte caracteres em códigos e texto numérico em valores.

[Descarregar o programa](08-ascii.bas)

**Executar:** RUN e ENTER. Prime ENTER para ver cada resultado.

**Resultado esperado:** ASCII=65; LETRA=B; DOBRO=25.

- ASC transforma A no seu código; CHR$ transforma o código seguinte em B.
- VAL converte 12.5 em número antes de multiplicar.
- STR$ permite juntar o resultado numérico a uma mensagem.

**Experimenta:** Troca A por Z e observa qual é o carácter seguinte.

## 09 · Ler e reler uma tabela

Armazena uma pequena tabela no programa e reinicia a sua leitura.

[Descarregar o programa](09-data.bas)

**Executar:** RUN e ENTER. ENTER passa da soma ao primeiro elemento relido.

**Resultado esperado:** TOTAL=30; PRIMEIRO=4.

- 20 contém quatro dados; READ consome um de cada vez.
- RESTORE 20 volta ao início da tabela.
- DATA fica numa linha própria.

**Experimenta:** Altera os quatro dados e verifica o novo total.

## 10 · Média e desvio padrão

Guarda amostras num vetor e calcula medidas descritivas em duas passagens.

[Descarregar o programa](10-statistics.bas)

**Executar:** RUN e ENTER. ENTER alterna entre média e desvio padrão populacional.

**Resultado esperado:** MEDIA=5; DESVIO=2.

- 20 reserva A(0) até A(8); este exemplo usa os índices 1 a 8.
- 100–120 acumulam os quadrados dos desvios à média.
- 130 divide por 8: é o desvio populacional, não o amostral.

**Experimenta:** Para o desvio amostral dos mesmos dados, divide por 7 antes de SQR.

## 11 · Uma matriz 2 × 2

Usa dois índices e ciclos aninhados para calcular um determinante.

[Descarregar o programa](11-matrix.bas)

**Executar:** RUN e ENTER. ENTER termina a apresentação do determinante.

**Resultado esperado:** DET=-2 para a matriz [1, 2; 3, 4].

- 20 reserva uma matriz; são usados os índices 1 e 2 em cada dimensão.
- 40–80 preenchem uma linha de cada vez.
- 90 calcula a diagonal principal menos a diagonal secundária.

**Experimenta:** Usa os dados 1,0,0,1: a matriz identidade tem determinante 1.

## 12 · Reutilizar uma sub-rotina

Calcula duas hipotenusas usando o mesmo bloco de código.

[Descarregar o programa](12-gosub.bas)

**Executar:** RUN e ENTER. ENTER avança da primeira hipotenusa para a segunda.

**Resultado esperado:** H1=5; H2=13.

- GOSUB 200 visita a sub-rotina e RETURN regressa à instrução seguinte.
- A, B e H são partilhadas com o programa principal.
- GOTO 900 evita entrar novamente na sub-rotina por sequência.

**Experimenta:** Muda o segundo par para 8 e 15. A hipotenusa será 17.

## 13 · Subprograma com parâmetros

Encapsula uma operação num subprograma com nome e argumentos.

[Descarregar o programa](13-subprogram.bas)

**Executar:** RUN e ENTER. Lê o resultado e prime ENTER.

**Resultado esperado:** DOBRO=14

- 30 passa A e B ao subprograma DOBRO.
- 100–120 usam X e Y como parâmetros; a atribuição a Y devolve o resultado em B.
- O subprograma fica depois do END do programa principal.

**Experimenta:** Chama DOBRO outra vez, usando B como entrada e outra variável como saída.

## 14 · Ângulos e logaritmos

Compara graus com radianos e verifica funções inversas.

[Descarregar o programa](14-science.bas)

**Executar:** RUN e ENTER. ENTER avança pelos três ecrãs. O programa repõe DEG antes de terminar.

**Resultado esperado:** GRAUS=.5; RADIANOS=.5; LOG=3 e LNEXP=2.

- DEG e RAD tornam explícita a unidade antes de calcular SIN.
- PI/6 radianos corresponde a 30 graus.
- LOG(1000) usa base 10; LN desfaz EXP.

**Experimenta:** Compara SIN(90) em DEG com SIN(PI/2) em RAD.

## 15 · Formatar números

Controla as casas decimais com um formato guardado numa linha IMAGE.

[Descarregar o programa](15-formatting.bas)

**Executar:** RUN e ENTER. ENTER passa de 12.50 para 3.14.

**Resultado esperado:** 12.50; 3.14, alinhados no mesmo campo.

- 100 define o formato e fica numa linha própria.
- PRINT USING reutiliza o mesmo formato para dois números.
- O formato muda a apresentação; não altera o valor guardado em A.

**Experimenta:** Troca ###.## por ###.### e observa os zeros e o arredondamento.

## 16 · Lançar dois dados

Transforma números pseudoaleatórios em inteiros de 1 a 6.

[Descarregar o programa](16-dice.bas)

**Executar:** RUN e ENTER. Observa os dois dados e depois a soma, premindo ENTER.

**Resultado esperado:** Cada dado pertence a 1…6; a soma pertence a 2…12. A semente 74 permite repetir a experiência.

- 20 fixa a semente para tornar a demonstração reprodutível.
- INT(6*RND)+1 transforma uma fração num resultado de dado.
- RND é usado sem parênteses.

**Experimenta:** Altera a semente. Para um dado de 20 faces, troca 6 por 20.

## 17 · Ordenar cinco valores

Uma ordenação por trocas combina vetores, ciclos e decisões.

[Descarregar o programa](17-sorting.bas)

**Executar:** RUN e ENTER. Prime ENTER para percorrer os cinco valores ordenados.

**Resultado esperado:** 1 → 2 → 4 → 7 → 9

- 40–60 carregam os dados no vetor.
- 70–110 comparam vizinhos e usam T como variável temporária na troca.
- O limite 5-I reduz o trabalho em cada passagem.

**Experimenta:** Troca > por < na linha 90 para ordenar por ordem decrescente.

## 18 · Posicionar texto no LCD

Constrói uma barra textual e escreve a partir de uma coluna escolhida.

[Descarregar o programa](18-display.bas)

**Executar:** RUN e ENTER. Lê o título e a barra; ENTER avança para a mensagem posicionada na coluna 8.

**Resultado esperado:** TI-74 seguido de oito asteriscos; depois COLUNA 8 começa na oitava posição.

- 20 limpa a linha; o ponto e vírgula conserva o conteúdo para a próxima escrita.
- 30 coloca a barra a partir da coluna 10.
- RPT$ cria os oito asteriscos sem os escrever um a um.

**Experimenta:** Troca 8 por 15 em RPT$ e desloca a barra com AT.

## 19 · Ler uma tecla sem ENTER

Uma interação direta mostra o carácter recebido e o respetivo código.

[Descarregar o programa](19-keyboard.bas)

**Executar:** RUN e ENTER. Em PRIME UMA LETRA, prime A sem ENTER. Depois usa ENTER para avançar pelos resultados.

**Resultado esperado:** TECLA=A e CODIGO=65 em maiúsculas; a minúscula a tem código 97.

- 30 espera por um carácter do teclado.
- A resposta não precisa de ENTER.
- O código depende da letra e do estado de maiúsculas da TI-74.

**Experimenta:** Experimenta um algarismo ou um sinal de pontuação.

## 20 · Aproximar uma raiz

Implementa o método de Newton e compara o resultado com SQR.

[Descarregar o programa](20-newton.bas)

**Executar:** RUN e ENTER. Introduz 2; ENTER avança da aproximação para SQR(2). Só são aceites valores entre 0 e 1000000, excluindo zero.

**Resultado esperado:** Com 2: cerca de 1.414213562 nos dois ecrãs. Com 81: 9.

- 20–30 validam o domínio usado nesta demonstração.
- 60 calcula uma aproximação a partir da anterior.
- 70–90 repetem até a diferença ser pequena ou se atingirem 40 iterações.

**Experimenta:** Muda a tolerância 1E-9 e consulta I após o programa para comparar o número de iterações.

## Manutenção e verificação

Edita `programs/library.json` e executa `node tools/library.cjs` para atualizar os `.bas`, este guia e o catálogo incorporado em `index.html`. `node tools/library.cjs --check` verifica a sincronização sem escrever. Depois, volta a gerar `TI-74.html` com `tools/package.cjs`.

`node tests/library.test.cjs` carrega as ROMs de `TI-74.html` e introduz todos os programas pela matriz de teclado, verificando perguntas, resultados e conclusão. Também aceita os caminhos de duas ROMs locais como argumentos. Os testes não incluem cópias de firmware.

Referência consultada: [Texas Instruments, TI-74 Programming Reference Guide](https://es.scribd.com/document/500278634/TI-74-Programming-Reference-Guide). Os programas e as explicações desta biblioteca são originais e foram verificados no emulador; não são transcrições dos exemplos do manual.

Esta seleção demonstra funcionalidades disponíveis neste emulador. Não inclui exemplos de cassete, impressora, DOCK-BUS ou cartuchos de RAM, que não estão implementados.
