#!/usr/bin/env pwsh

# Initializing variables
$HmtRoot = if ($env:HMT_INSTALL) { $env:HMT_INSTALL } else { "$Home\.hmt" }
$HmtPath = "$HmtRoot\hmt.zip"

$FileName="hopmytrack-win-x64"
$URL = "https://github.com/gastonchenet/hopmytrack/releases/latest/download/$FileName.zip"

# Rebuilding the path to the executable
Remove-Item $HmtRoot -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "$HmtRoot\bin" | Out-Null

# Downloading the executable with curl or Invoke-RestMethod
curl.exe -#SfLo $HmtPath $URL

if ($LASTEXITCODE -ne 0) {
  Invoke-RestMethod -Uri $URL -OutFile $HmtPath
}

# Checking if the download was successful
if (!(Test-Path $HmtPath)) {
  Write-Output "Install Failed - could not download $URL"
  Write-Output "The file '$HmtPath' does not exist. Did an antivirus delete it?`n"
  return 1
}

# Unzipping the executable
try {
  Expand-Archive $HmtPath $HmtRoot -Force
} catch {
  Write-Output "Install Failed - could not unzip $HmtPath"
  Write-Error $_

  return 1
}

# Moving the executable to the bin folder
Move-Item -Path "$HmtRoot\$FileName.exe" -Destination "$HmtRoot\bin\hmt.exe" -Force

# Cleaning up the zip file
Remove-Item $HmtPath -Force

# Verifying if there is other hmt.exe in the PATH
$PathAlreadyExists = $false;

try {
  $Existing = Get-Command hmt -ErrorAction

  if ($Existing.Source -ne $HmtPath) {
    Write-Warning "Note: Another hmt.exe is already in %PATH% at $($Existing.Source)`nTyping 'hmt' in your terminal will not use what was just installed."

    $PathAlreadyExists = $true;
  }
} catch {}

$Version = "$HmtRoot\bin\hmt.exe" --version

Write-Output "HopMyTrack succesfully installed!`nYou're currently on the latest version $Version"

# Adding the executable to the PATH
if(!$PathAlreadyExists) {
  $CurrentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
  
  $NewPath = "$CurrentPath;$HmtRoot\bin"

  [System.Environment]::SetEnvironmentVariable("Path", $NewPath, [System.EnvironmentVariableTarget]::User)

  Write-Output "`nStart another terminal to be able to use the command 'hmt'"
}

# Adding the uninstall script
$rootKey = $null

try {
  $RegistryKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\HopMyTrack"  
  $rootKey = New-Item -Path $RegistryKey -Force

  New-ItemProperty -Path $RegistryKey -Name "DisplayName" -Value "Hmt" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $RegistryKey -Name "InstallLocation" -Value "$HmtRoot" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $RegistryKey -Name "DisplayIcon" -Value "$HmtRoot\bin\hmt.exe" -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $RegistryKey -Name "UninstallString" -Value "powershell -c `"& `'$HmtRoot\uninstall.ps1`' -PauseOnError`" -ExecutionPolicy Bypass" -PropertyType String -Force | Out-Null
} catch {
  if ($null -ne $rootKey) {
    Remove-Item -Path $RegistryKey -Force
  }
}