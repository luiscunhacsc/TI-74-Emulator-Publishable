$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
& node (Join-Path $PSScriptRoot 'public.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Public build failed.' }
& node (Join-Path $projectRoot 'tests/public.test.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Public release checks failed.' }
$releaseFiles = @('index.html', 'index.pt-PT.html', 'README.md', 'README.pt-PT.md', 'LICENSE.txt') | ForEach-Object {
    Join-Path (Join-Path $projectRoot 'public') $_
}
$archivePath = Join-Path $projectRoot 'Pocket-BASIC-Emulator-public.zip'
# Explicit allowlist: never recursively archive the working directory.
Compress-Archive -LiteralPath $releaseFiles -DestinationPath $archivePath -Force
Write-Output "Public package: $archivePath"
