# Pocket BASIC Emulator

Open **[index.html](index.html)** in Chrome, Edge or Firefox. Português: [index.pt-PT.html](index.pt-PT.html) / [guia](README.pt-PT.md). No installation or server is needed.

Independent emulator of the Texas Instruments TI-74 BASICALC. Not affiliated with, sponsored by, or endorsed by Texas Instruments. These names identify the emulated hardware only; all trademarks belong to their respective owners.

## ROMs you need

No manufacturer firmware is included. The software license does not grant rights to ROMs, cartridges or character fonts. Files are processed locally in your browser and are not uploaded. ROMs, cartridges and character fonts are not supplied or linked for download.

| ROM | Filename | Bytes | CRC32 |
| --- | --- | ---: | --- |
| CPU / internal | `c70009.ic2` | 4096 | `55A2F7C0` |
| System | `1060281-101_hn61256pd12.ic1` | 32768 | `019AAA2F` |

These filenames and CRC32 values identify compatible dumps; they are not download links or proof of permission. Filenames may differ: the loader checks size and checksum.

Also recognized: system ROM 001060281-1_hn61256pc93.ic1 (32,768 bytes; CRC32 499B69D1). The primary system revision above was used for integration testing.

Optional character font: hd44780_a00.bin (4,096 bytes). It is not needed to run BASIC; an approximate font is built in. The same ROM policy applies.

**ROM policy:** Use only ROMs you are legally entitled to copy and use. For this project, dump the firmware from a calculator you own, only where applicable law permits. Owning the hardware does not automatically authorize downloading copies from the internet. Do not redistribute ROMs without permission.

## Getting started

1. Click **Load ROMs**, select your two local ROM files, then **Start emulator**. Extract them first if they are in an archive. Remembering ROMs in this browser is optional.
2. When `W30 Initialized` appears, press **CLR**. In BASIC mode, type `2+2` and press **ENTER**.
3. Try the 20 built-in examples: **Copy to editor**, **Send to calculator**, wait for **Text entered**, then **RUN** and **ENTER**. **Replace… (NEW)** erases the previous program.
4. **Save .bas** saves the editor text. **Save state** saves the machine session without ROMs. Keep an exported copy of important programs.

Without ROMs, **Test hardware** runs the original diagnostic; the example library can still be read and downloaded. The diagnostic does not implement BASIC.

## License and limits

JavaScript adaptation of the BSD-3-Clause portions of MAME. Reference authors: hap, Tim Lindner and Sandro Ronco. See [LICENSE.txt](LICENSE.txt) and the in-app references. Copyright notices are retained. Manufacturer firmware is excluded from this license.

Experimental compatibility and timing; cassette storage, printers, DOCK-BUS and RAM cartridges are not implemented. Supplied as is, without warranty.
