# Pocket BASIC Emulator

Abre **[index.pt-PT.html](index.pt-PT.html)** no Chrome, Edge ou Firefox. English: [index.html](index.html) / [guide](README.md). Não precisa de instalação nem servidor.

Emulador independente da Texas Instruments TI-74 BASICALC. Sem afiliação, patrocínio ou aprovação da Texas Instruments. Estes nomes identificam apenas o equipamento emulado; todas as marcas pertencem aos respetivos titulares.

## ROMs necessárias

Não inclui firmware do fabricante. A licença do software não concede direitos sobre ROMs, cartuchos ou fontes de caracteres. Os ficheiros são processados localmente no teu navegador e não são enviados para um servidor. Não são fornecidos ficheiros nem ligações de descarga de ROMs, cartuchos ou fontes de caracteres.

| ROM | Ficheiro | Bytes | CRC32 |
| --- | --- | ---: | --- |
| CPU / interna | `c70009.ic2` | 4096 | `55A2F7C0` |
| Sistema | `1060281-101_hn61256pd12.ic1` | 32768 | `019AAA2F` |

Estes nomes e valores CRC32 identificam cópias compatíveis; não são ligações de descarga nem prova de autorização. Os nomes podem variar: o carregador verifica o tamanho e a soma de controlo.

Também reconhecida: ROM de sistema 001060281-1_hn61256pc93.ic1 (32768 bytes; CRC32 499B69D1). A revisão principal acima foi usada nos testes de integração.

Fonte de caracteres opcional: hd44780_a00.bin (4096 bytes). Não é necessária para executar BASIC; existe uma fonte aproximada integrada. Aplica-se a mesma política de ROMs.

**Política de ROMs:** Usa apenas ROMs que tenhas o direito legal de copiar e utilizar. Para este projeto, extrai o firmware de uma calculadora tua, apenas quando a lei aplicável o permitir. Possuir o equipamento não autoriza automaticamente o descarregamento de cópias da Internet. Não redistribuas ROMs sem autorização.

## Como começar

1. Usa **Carregar ROMs**, seleciona os dois ficheiros locais e prime **Iniciar emulador**. Extrai-os primeiro se estiverem num arquivo. Guardar as ROMs neste navegador é opcional.
2. Quando aparecer `W30 Initialized`, prime **CLR**. Em BASIC, escreve `2+2` e prime **ENTER**.
3. Experimenta os 20 exemplos: **Copiar para o bloco**, **Introduzir na calculadora**, espera pelo fim do envio e prime **RUN** e **ENTER**. **Substituir… (NEW)** apaga o programa anterior.
4. **Guardar .bas** guarda o texto do editor. **Guardar estado** guarda a sessão sem ROMs. Conserva uma cópia exportada dos programas importantes.

Sem ROMs, **Testar hardware** executa o diagnóstico original; podes consultar e descarregar os exemplos. O diagnóstico não implementa BASIC.

## Licença e limites

Adaptação JavaScript das partes BSD-3-Clause do MAME. Autores das referências: hap, Tim Lindner e Sandro Ronco. Consulta [LICENSE.txt](LICENSE.txt) e as referências na aplicação. Os avisos de direitos de autor foram preservados. O firmware do fabricante está excluído desta licença.

Compatibilidade e temporização experimentais; cassete, impressora, DOCK-BUS e cartuchos de RAM não estão implementados. Fornecido tal como está, sem garantia.
