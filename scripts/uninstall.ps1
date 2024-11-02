# Uninstalling
try {
  Remove-Item "$PSScriptRoot\bin\hmt.exe" -Force
} catch {
  Write-Host "Could not delete $PSScriptRoot\bin\hmt.exe."
  Write-Host "Please close all instances of hmt.exe and try again."
  
  exit 1
}

try {
  Remove-Item $PSScriptRoot -Recurse -Force
} catch {
  Write-Host "Could not delete $PSScriptRoot."
  Write-Host "Please close all instances of hmt.exe and try again."

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
