# TI-74 BASICALC — US English edition

**Public distribution:** use [Pocket BASIC Emulator](public/index.html) and its [public guide](public/README.md). Share only `public/` or `Pocket-BASIC-Emulator-public.zip`. The standalone `TI-74*.html` files described below contain private ROM copies and must not be included in a public release. Do not publish this entire working directory.

Rebuild and check the public package with `powershell -File tools/release-public.ps1`. It uses firmware-free sources, preserves the license, and packages only five approved files. `node tools/public.cjs --check` checks generated public files. The private editions remain separate.

Open **[TI-74.en-US.html](TI-74.en-US.html)** directly in Chrome, Edge, or Firefox. This single file contains the interface, emulator, English program library, and the same owner-supplied ROMs as the Portuguese edition. No server, installation, or internet connection is needed.

On first startup, the display shows `W30 Initialized`. Press **CLR** to begin. The initial mode is BASIC; **MODE** switches to CALC. In BASIC, type `2+2` and press **ENTER**. In CALC, use **SHIFT + ENTER** for `=`.

A tap on a physical or on-screen key enters one character. Hold the key for more than half a second to repeat it. The repeat delay does not depend on emulation speed.

## Programs and saved sessions

The program editor enters text through the emulated keyboard. To run the initial example, click **Send to TI-74**, wait for **Text entered**, press **RUN**, then **ENTER**. Type `S` and press **ENTER** to see **55**.

**Save .bas** exports the text in the editor. **Save state** exports the actual TI-74 memory. Automatic saving depends on browser storage; keep an exported copy of important programs. English and Portuguese editions use separate browser storage. Exported states can be restored in either edition when the ROMs and cartridge match. Loading a state preserves its original program text.

Use a period for decimal numbers. Enter BASIC numbers without thousands separators. The interface uses US English number formatting; the original firmware controls the calculator display.

## BASIC Library

All **20 examples** include English code comments, prompts, output, explanations, instructions, expected results, and exercises. Search by command or topic, select an example, and click **Copy to editor**, then **Send to TI-74** in BASIC mode.

For library examples, **Replace… (NEW)** is selected. This erases the previous program before entering the new lines. Copying to the editor alone does not change TI-74 memory, and **Restore previous text** undoes the editor change. Once the lines have been entered, press **RUN**, then **ENTER**. Each `PAUSE` waits for ENTER.

The [English library guide](programs/en-US/README.md) and downloadable `.bas` files cover expressions, loops, validation, strings, ASCII, DATA tables, statistics, matrices, GOSUB, subprogram parameters, trigonometry, IMAGE formatting, pseudorandom numbers, sorting, LCD positioning, KEY$, and Newton’s method. The library also works offline before ROMs are loaded.

## Files and rebuilding

- `TI-74.en-US.html`: standalone English edition with the existing owner-supplied ROMs embedded.
- `index.en-US.html`: generated English source without firmware, including a ROM picker and hardware diagnostic.
- `locales/en-US.json`: interface, accessibility, help, error, and diagnostic translations.
- `programs/en-US/library.json`: English example catalog and BASIC code.
- `tools/localize.cjs`: generates both English HTML files, the `.bas` files, and the library guide from the shared `index.html` source.
- `TI-74.html` and `index.html`: original Portuguese editions.

After editing the shared source or English translations, run:

```powershell
node tools/localize.cjs
node tools/localize.cjs --check
```

The generator reuses firmware already embedded in the local `TI-74.html`; it makes no network requests. Generated English HTML files should not be edited directly. If you only have separate ROM files, generate the source and package it explicitly:

```powershell
node tools/localize.cjs --source-only
node tools/package.cjs 'path\c70009.ic2' 'path\1060281-101_hn61256pd12.ic1' TI-74.en-US.html index.en-US.html
```

For that workflow, `node tools/localize.cjs --check --source-only` checks the generated files without requiring the Portuguese package. Editing the Portuguese example catalog still uses `node tools/library.cjs` as described in the [Portuguese README](README.md).

## Validation

```powershell
node tests/core.test.cjs
node tests/core.test.cjs --en-US
node tests/library.test.cjs --en-US
node tools/library.cjs --check
node tools/localize.cjs --check
```

The library test executes all 20 examples through the keyboard on real TI-74 firmware, checking prompts and results. It uses the ROMs in `TI-74.en-US.html` by default, or accepts CPU and system ROM paths after `--en-US`. ROM CRC32 values: `55A2F7C0` (CPU, 4,096 bytes) and `019AAA2F` (system, 32,768 bytes).

The emulator uses HTML, CSS, and JavaScript. The original ROMs perform calculations and interpret BASIC. The hardware diagnostic uses original TMS7000 machine code and can test the keyboard and LCD without TI firmware.

## Known limitations

This is an experimental emulator. Speed 1× runs instructions at 4 MHz / 2; the additional slow-memory divider is not implemented. DOCK-BUS, printers, cassette storage, and RAM cartridges are not emulated. ROM cartridges up to 32 KiB are supported but have not been tested with original software. The built-in LCD font approximates the characters; an optional 4,096-byte HD44780 A00 ROM provides the original glyphs. Full compatibility and exact timing are not claimed.

## References and license

Adapted from the BSD-3-Clause portions of MAME: [TI-74](https://github.com/mamedev/mame/blob/master/src/mame/ti/ti74.cpp), [TMS7000](https://github.com/mamedev/mame/tree/master/src/devices/cpu/tms7000), and [HD44780](https://github.com/mamedev/mame/blob/master/src/devices/video/hd44780.cpp). Reference authors: hap, Tim Lindner, and Sandro Ronco. The complete license and attribution are embedded in each HTML file. The emulator license does not cover TI ROMs. This is an independent project, not affiliated with Texas Instruments.
