# Killing the process if it is running
function Kill-Hmt {
  try {
    Get-Process -Name hmt | Where-Object { $_.Path -eq "$PSScriptRoot\bin\hmt.exe" } | Stop-Process -Force
  } catch [Microsoft.PowerShell.Commands.ProcessCommandException] {
  } catch {
    Write-Host "There are open instances of hmt.exe that could not be automatically closed."
    exit 1
  }
}

# Uninstalling
try {
  Kill-Hmt
  Remove-Item "$PSScriptRoot\bin\hmt.exe" -Force
} catch {
  Kill-Hmt
  Start-Sleep -Seconds 1

  try {
    Remove-Item "$PSScriptRoot\bin\hmt.exe" -Force
  } catch {
    Write-Host $_
    Write-Host "`n`nCould not delete $PSScriptRoot\bin\hmt.exe."
    Write-Host "Please close all instances of hmt.exe and try again."
    
    exit 1
  }
}

try {
  Remove-Item $PSScriptRoot -Recurse -Force
} catch {
  Write-Host "Could not delete $PSScriptRoot."
  exit 1
}

# Removing the executable from the PATH
$CurrentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)
$NewPath = $CurrentPath -replace [RegEx]::Escape("$PSScriptRoot\bin"), ""
[System.Environment]::SetEnvironmentVariable("Path", $NewPath, [System.EnvironmentVariableTarget]::User)

# Removing the registry entry
try {
  $item = Get-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\HopMyTrack";
  $location = $item.GetValue("InstallLocation");
  
  if ($location -eq "${PSScriptRoot}") {
    Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\HopMyTrack" -Recurse
  }
} catch {
}
