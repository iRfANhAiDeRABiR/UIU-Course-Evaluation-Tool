# Build script to generate UIU-UCAM-Evaluation-Automator-Firefox-v1.0.1.zip
Write-Host "Building Firefox Add-on package..." -ForegroundColor Cyan

$manifest = Get-Content manifest.json -Raw | ConvertFrom-Json
$manifest.background = [PSCustomObject]@{ scripts = @("background.js") }

$tempDir = New-Item -ItemType Directory -Path "$env:TEMP\firefox_ext_build" -Force
$manifest | ConvertTo-Json -Depth 10 | Set-Content "$tempDir\manifest.json"

Copy-Item background.js, content.js, popup.html, popup.css, popup.js, icon16.png, icon48.png, icon128.png -Destination $tempDir
Compress-Archive -Path "$tempDir\*" -DestinationPath "UIU-UCAM-Evaluation-Automator-Firefox-v1.0.1.zip" -Force
Remove-Item -Recurse -Force $tempDir

Write-Host "Packaging complete: UIU-UCAM-Evaluation-Automator-Firefox-v1.0.1.zip" -ForegroundColor Green
