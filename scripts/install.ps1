#!/usr/bin/env pwsh

$HmtRoot = if ($env:HMT_INSTALL) { $env:HMT_INSTALL } else { "${Home}\.hmt" }
$HmtBin = mkdir -Force "${HmtRoot}\bin"
$HmtPath = "${HmtBin}\hmt.exe"

$FileName="hopmytrack-win-x64.exe"
$BaseURL = "https://github.com/gastonchenet/hopmytrack"
$URL = "${BaseURL}/releases/latest/download/${FileName}"

function Publish-Env {
  if (-not ("Win32.NativeMethods" -as [Type])) {
    Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition @"
[DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
public static extern IntPtr SendMessageTimeout(
    IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam,
    uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
"@
  }
  $HWND_BROADCAST = [IntPtr] 0xffff
  $WM_SETTINGCHANGE = 0x1a
  $result = [UIntPtr]::Zero
  [Win32.NativeMethods]::SendMessageTimeout($HWND_BROADCAST,
    $WM_SETTINGCHANGE,
    [UIntPtr]::Zero,
    "Environment",
    2,
    5000,
    [ref] $result
  ) | Out-Null
}

function Write-Env {
  param([String]$Key, [String]$Value)

  $RegisterKey = Get-Item -Path 'HKCU:'

  $EnvRegisterKey = $RegisterKey.OpenSubKey('Environment', $true)
  if ($null -eq $Value) {
    $EnvRegisterKey.DeleteValue($Key)
  } else {
    $RegistryValueKind = if ($Value.Contains('%')) {
      [Microsoft.Win32.RegistryValueKind]::ExpandString
    } elseif ($EnvRegisterKey.GetValue($Key)) {
      $EnvRegisterKey.GetValueKind($Key)
    } else {
      [Microsoft.Win32.RegistryValueKind]::String
    }
    $EnvRegisterKey.SetValue($Key, $Value, $RegistryValueKind)
  }

  Publish-Env
}

function Get-Env {
  param([String] $Key)

  $RegisterKey = Get-Item -Path 'HKCU:'
  $EnvRegisterKey = $RegisterKey.OpenSubKey('Environment')
  $EnvRegisterKey.GetValue($Key, $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames)
}

try {
  Remove-Item "${HmtBin}\hmt.exe" -Force
} catch [System.Management.Automation.ItemNotFoundException] {
  # ignore
} catch [System.UnauthorizedAccessException] {
  $openProcesses = Get-Process -Name hmt | Where-Object { $_.Path -eq "${HmtBin}\hmt.exe" }

  if ($openProcesses.Count -gt 0) {
    Write-Output "Install Failed - An older installation exists and is open. Please close open Hmt processes and try again."
    return 1
  }

  Write-Output "Install Failed - An unknown error occurred while trying to remove the existing installation"
  Write-Output $_

  return 1
} catch {
  Write-Output "Install Failed - An unknown error occurred while trying to remove the existing installation"
  Write-Output $_

  return 1
}

$null = mkdir -Force $HmtBin

curl.exe -#SfLo $HmtPath $URL

if ($LASTEXITCODE -ne 0) {
  Invoke-RestMethod -Uri $URL -OutFile $HmtPath
}

if (!(Test-Path $HmtPath)) {
  Write-Output "Install Failed - could not download $URL"
  Write-Output "The file '$HmtPath' does not exist. Did an antivirus delete it?`n"
  return 1
}

$hasExistingOther = $false;

try {
  $existing = Get-Command hmt -ErrorAction
  if ($existing.Source -ne $HmtPath) {
    Write-Warning "Note: Another hmt.exe is already in %PATH% at $($existing.Source)`nTyping 'hmt' in your terminal will not use what was just installed.`n"
    $hasExistingOther = $true;
  }
} catch {}

if(!$hasExistingOther) {
  $Path = (Get-Env -Key "Path") -split ';'

  if ($Path -notcontains $HmtBin) {
    if (-not $NoPathUpdate) {
      $Path += $HmtBin
      Write-Env -Key 'Path' -Value ($Path -join ';')
      $env:PATH = $Path;
    } else {
      Write-Output "Skipping adding '${HmtBin}' to the user's %PATH%`n"
    }
  }

  Write-Output "To get started, restart your terminal/editor, then type `"hmt`"`n"
}