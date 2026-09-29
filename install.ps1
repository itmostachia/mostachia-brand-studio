# Instalador de skills de terceros para Windows (PowerShell 5.1+).
# No redistribuye codigo ajeno: clona cada upstream en el SHA fijado de upstream.json
# dentro de .upstream\ (gitignored) y crea junctions en las carpetas de skills del usuario.
#
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File install.ps1 [-Target claude|codex|all]
#        [-HomeDir DIR] [-All] [-Only a,b] [-Force] [-Update] [-DryRun] [-SkipDeps] [-Playwright]
[CmdletBinding()]
param(
  [ValidateSet('claude', 'codex', 'all')][string]$Target = 'all',
  [string]$HomeDir = $env:USERPROFILE,
  [switch]$All,
  [string[]]$Only = @(),
  [switch]$Force,
  [switch]$Update,
  [switch]$DryRun,
  [switch]$SkipDeps,
  [switch]$Playwright
)

$ErrorActionPreference = 'Continue'
$RepoDir = (Resolve-Path -LiteralPath $PSScriptRoot).ProviderPath.TrimEnd('\')
$HomeDir = [System.IO.Path]::GetFullPath($HomeDir).TrimEnd('\')
# -Only "a,b" llega como un solo string cuando se usa -File
$OnlyList = @()
foreach ($o in $Only) { $OnlyList += ($o -split ',') | Where-Object { $_ -ne '' } }

function Say([string]$msg) { Write-Host $msg }

# Ejecuta un binario nativo sin que stderr se convierta en ErrorRecord (PS 5.1)
function Invoke-Native([string]$exe, [string[]]$argList, [string]$workDir = $RepoDir) {
  $quoted = foreach ($a in $argList) {
    if ($a -match '[\s"]' -or $a -eq '') { '"' + ($a -replace '"', '\"') + '"' } else { $a }
  }
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $exe
  $psi.Arguments = ($quoted -join ' ')
  $psi.WorkingDirectory = $workDir
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  try {
    $p = [System.Diagnostics.Process]::Start($psi)
  } catch {
    return @{ Code = 9009; Out = "$_" }
  }
  $errTask = $p.StandardError.ReadToEndAsync()
  $out = $p.StandardOutput.ReadToEnd()
  $p.WaitForExit()
  return @{ Code = $p.ExitCode; Out = ($out + $errTask.Result).Trim() }
}

function Get-ExePath([string]$name) {
  $c = Get-Command $name -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($c) { return $c.Source }
  return $null
}

function Test-VersionGe([string]$have, [string]$min) {
  try { return ([version]$have -ge [version]$min) } catch { return $false }
}

# ---------- 1. Dependencias ----------
Say '== Dependencias'
$missing = $false
$git = Get-ExePath 'git'
if ($git) { Say ('  git: ' + (Invoke-Native $git @('--version')).Out) }
else { Say '  FALTA git -> winget install Git.Git  (o https://git-scm.com/download/win)'; $missing = $true }

$node = Get-ExePath 'node'
$nodeV = ''
if ($node) { $nodeV = (Invoke-Native $node @('-p', 'process.versions.node')).Out }
if ($node -and (Test-VersionGe $nodeV '20.0.0')) { Say "  node: $nodeV" }
else { Say "  FALTA node >= 20 (tenes: $nodeV) -> winget install OpenJS.NodeJS.LTS"; $missing = $true }

$py = $null; $pyArgs = @()
$candidates = @(@('py', @('-3')), @('python', @()), @('python3', @()))
foreach ($cand in $candidates) {
  $exe = Get-ExePath $cand[0]
  if (-not $exe) { continue }
  $r = Invoke-Native $exe ($cand[1] + @('-c', 'import sys;print(sys.version.split()[0])'))
  if ($r.Code -eq 0 -and (Test-VersionGe $r.Out '3.10.0')) { $py = $exe; $pyArgs = $cand[1]; Say "  python: $($r.Out) ($($cand[0]))"; break }
}
if (-not $py) { Say '  FALTA python >= 3.10 -> winget install Python.Python.3.12'; $missing = $true }

if ($missing) { Say 'Instala lo que falta y volve a correr.'; exit 1 }

if (-not $SkipDeps) {
  if (Test-Path -LiteralPath (Join-Path $RepoDir 'package.json')) {
    Say '  npm install (repo)'
    if ($DryRun) { Say '  [dry-run] npm install' } else {
      $r = Invoke-Native 'cmd.exe' @('/c', 'npm', 'install', '--no-audit', '--no-fund')
      if ($r.Code -ne 0) { Say "  AVISO: npm install fallo: $($r.Out)" }
    }
  }
  Say '  pip install Pillow pypdfium2'
  if ($DryRun) { Say '  [dry-run] pip install' } else {
    $r = Invoke-Native $py ($pyArgs + @('-m', 'pip', 'install', '--quiet', 'Pillow', 'pypdfium2'))
    if ($r.Code -ne 0) { Say "  AVISO: pip install fallo: $($r.Out)" }
  }
  if ($Playwright) {
    if ($DryRun) { Say '  [dry-run] npx playwright install chromium' } else {
      $r = Invoke-Native 'cmd.exe' @('/c', 'npx', '--yes', 'playwright', 'install', 'chromium')
      if ($r.Code -ne 0) { Say "  AVISO: playwright install fallo: $($r.Out)" }
    }
  }
} else {
  Say '  (-SkipDeps: no se instalan paquetes)'
}

# ---------- 2. .gitignore ----------
$gi = Join-Path $RepoDir '.gitignore'
$giLines = @()
if (Test-Path -LiteralPath $gi) { $giLines = @(Get-Content -LiteralPath $gi) }
foreach ($line in @('.upstream/', 'node_modules/')) {
  if ($giLines -notcontains $line) {
    if ($DryRun) { Say "  [dry-run] agregar $line a .gitignore" }
    else { [System.IO.File]::AppendAllText($gi, "$line`n") }
  }
}

# ---------- 3. Targets ----------
switch ($Target) {
  'claude' { $targets = @("$HomeDir\.claude\skills") }
  'codex' { $targets = @("$HomeDir\.agents\skills", "$HomeDir\.codex\skills") }
  default { $targets = @("$HomeDir\.claude\skills", "$HomeDir\.agents\skills", "$HomeDir\.codex\skills") }
}

$results = New-Object System.Collections.ArrayList
function Add-Result($status, $skill, $tgt, $detail) {
  [void]$results.Add([pscustomobject]@{ Status = $status; Skill = $skill; Target = $tgt; Detail = $detail })
}

function Test-Present([string]$p) {
  try { [void][System.IO.File]::GetAttributes($p); return $true } catch { return $false }
}
function Get-LinkTarget([string]$p) {
  $attr = [System.IO.File]::GetAttributes($p)
  if (($attr -band [System.IO.FileAttributes]::ReparsePoint) -eq 0) { return $null }
  $item = Get-Item -LiteralPath $p -Force -ErrorAction SilentlyContinue
  if (-not $item) { return '' }
  $t = @($item.Target) | Select-Object -First 1
  if (-not $t) { return '' }
  return ([string]$t -replace '^\\\\\?\\', '' -replace '^\\\?\?\\', '').TrimEnd('\')
}
function Test-SamePath([string]$a, [string]$b) {
  return ($a.TrimEnd('\').ToLowerInvariant() -eq $b.TrimEnd('\').ToLowerInvariant())
}
function Test-Managed([string]$t) {
  $lt = $t.ToLowerInvariant()
  return ($lt.StartsWith(("$RepoDir\.upstream\").ToLowerInvariant()) -or $lt.StartsWith(("$RepoDir\skills\").ToLowerInvariant()))
}

function Add-SkillLink([string]$src, [string]$name) {
  if ((-not $DryRun) -and (-not (Test-Path -LiteralPath (Join-Path $src 'SKILL.md')))) {
    foreach ($t in $targets) { Add-Result 'failed' $name $t "sin SKILL.md en $src" }
    return
  }
  foreach ($t in $targets) {
    $dest = Join-Path $t $name
    if ((-not $DryRun) -and (-not (Test-Path -LiteralPath $t))) { [void](New-Item -ItemType Directory -Path $t -Force) }
    if (Test-Present $dest) {
      $cur = Get-LinkTarget $dest
      if ($cur -and (Test-SamePath $cur $src)) { Add-Result 'already' $name $t ''; continue }
      if ($cur -and (Test-Managed $cur) -and $Force) {
        if ($DryRun) { Add-Result 'replaced' $name $t '(dry-run)'; continue }
        # rmdir sobre un junction borra solo el link, nunca el contenido
        $r = Invoke-Native 'cmd.exe' @('/c', 'rmdir', $dest)
        if ($r.Code -eq 0) { $r = Invoke-Native 'cmd.exe' @('/c', 'mklink', '/J', $dest, $src) }
        if ($r.Code -eq 0) { Add-Result 'replaced' $name $t "era $cur" } else { Add-Result 'failed' $name $t $r.Out }
        continue
      }
      $why = $cur
      if ($null -eq $cur) { $why = 'carpeta real' } elseif ($cur -eq '') { $why = 'link no resoluble' }
      Add-Result 'skipped-existing' $name $t $why
      continue
    }
    if ($DryRun) { Add-Result 'installed' $name $t '(dry-run)'; continue }
    $r = Invoke-Native 'cmd.exe' @('/c', 'mklink', '/J', $dest, $src)
    if ($r.Code -eq 0) { Add-Result 'installed' $name $t '' } else { Add-Result 'failed' $name $t $r.Out }
  }
}

function Invoke-Git([string[]]$gitArgs, [string]$dir) {
  $r = Invoke-Native $git $gitArgs $dir
  if ($r.Code -ne 0) { Say "    git $($gitArgs -join ' '): $($r.Out)" }
  return ($r.Code -eq 0)
}

function Sync-Upstream($e) {
  $dir = Join-Path $RepoDir (".upstream\" + $e.name)
  $short = $e.ref.Substring(0, 10)
  if ((Test-Path -LiteralPath (Join-Path $dir '.git')) -and (-not $Update)) {
    $head = (Invoke-Native $git @('rev-parse', 'HEAD') $dir).Out
    if ($head -eq $e.ref) { Say "  $($e.name): ya en $short"; return $true }
  }
  Say "  $($e.name): fetch $($e.repo)@$short"
  if ($DryRun) { return $true }
  if (-not (Test-Path -LiteralPath $dir)) { [void](New-Item -ItemType Directory -Path $dir -Force) }
  if (-not (Invoke-Git @('init', '-q') $dir)) { return $false }
  [void](Invoke-Native $git @('config', 'core.longpaths', 'true') $dir)
  [void](Invoke-Native $git @('remote', 'remove', 'origin') $dir)
  if (-not (Invoke-Git @('remote', 'add', 'origin', "https://github.com/$($e.repo).git") $dir)) { return $false }
  if ($e.root_skill) {
    [void](Invoke-Native $git @('sparse-checkout', 'disable') $dir)
  } else {
    $dirs = foreach ($s in $e.skills) { if ($e.path -eq '.') { $s } else { "$($e.path)/$s" } }
    if (-not (Invoke-Git (@('sparse-checkout', 'set', '--cone') + @($dirs)) $dir)) { return $false }
  }
  if (-not (Invoke-Git @('fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', $e.ref) $dir)) { return $false }
  return (Invoke-Git @('-c', 'advice.detachedHead=false', 'checkout', '-q', '--force', 'FETCH_HEAD') $dir)
}

# ---------- 4. Upstreams ----------
Say '== Upstreams (.upstream\)'
$entries = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $RepoDir 'upstream.json') | ConvertFrom-Json
$manual = @()
foreach ($e in $entries) {
  $install = 'clone'
  if ($e.install) { $install = $e.install }
  if ($install -ne 'clone') { $manual += "- $($e.name) ($($e.repo)): $($e.notes)"; continue }
  if ($OnlyList.Count -gt 0) {
    if ($OnlyList -notcontains $e.name) { continue }
    if ($e.status -ne 'verified') { Say "  AVISO: $($e.name) esta marcado '$($e.status)' (lo pediste con -Only)" }
  } else {
    if ($e.status -ne 'verified') { continue }
    if ((-not $e.default) -and (-not $All)) { continue }
  }
  if (-not (Sync-Upstream $e)) {
    foreach ($s in $e.skills) { foreach ($t in $targets) { Add-Result 'failed' $s $t "fetch de $($e.repo) fallo" } }
    continue
  }
  $base = Join-Path $RepoDir (".upstream\" + $e.name)
  foreach ($s in $e.skills) {
    if ($e.root_skill) { $src = $base }
    elseif ($e.path -eq '.') { $src = Join-Path $base $s }
    else { $src = Join-Path $base (($e.path -replace '/', '\') + "\$s") }
    Add-SkillLink $src $s
  }
}

# ---------- 5. Skills propias del repo ----------
Say '== Skills propias (skills\)'
$own = Join-Path $RepoDir 'skills'
if (Test-Path -LiteralPath $own) {
  foreach ($d in (Get-ChildItem -LiteralPath $own -Directory)) {
    if (Test-Path -LiteralPath (Join-Path $d.FullName 'SKILL.md')) { Add-SkillLink $d.FullName $d.Name }
  }
}

# ---------- 6. Resumen ----------
Say ''
Say '== Resumen'
$rows = foreach ($st in @('installed', 'already', 'replaced', 'skipped-existing', 'failed')) {
  $row = [ordered]@{ estado = $st }
  foreach ($t in $targets) {
    $key = $t.Substring($HomeDir.Length + 1)
    $row[$key] = @($results | Where-Object { $_.Status -eq $st -and $_.Target -eq $t }).Count
  }
  [pscustomobject]$row
}
$rows | Format-Table -AutoSize | Out-String -Width 200 | Write-Host
$detail = @($results | Where-Object { $_.Status -eq 'skipped-existing' -or $_.Status -eq 'failed' })
if ($detail.Count -gt 0) {
  Say 'Detalle (skipped-existing / failed):'
  $detail | Select-Object Status, Skill, @{ n = 'Target'; e = { $_.Target.Substring($HomeDir.Length + 1) } }, Detail |
    Format-Table -AutoSize | Out-String -Width 250 | Write-Host
}
if ($manual.Count -gt 0) { Say 'Se instalan aparte (no se clonan):'; $manual | ForEach-Object { Say $_ } }
Say ''
Say "Verificar: node scripts/verify-install.mjs --home `"$HomeDir`" --target $Target"
if (@($results | Where-Object { $_.Status -eq 'failed' }).Count -gt 0) { exit 1 }
exit 0
