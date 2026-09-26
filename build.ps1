# Build script to generate ZIP packages for both Chrome and Firefox
Write-Host "Building Chrome & Firefox Extension packages..." -ForegroundColor Cyan

# Package Chrome Extension
Compress-Archive -Path "chrome\*" -DestinationPath "UIU-UCAM-Evaluation-Automator-Chrome-v1.0.2.zip" -Force
Compress-Archive -Path "chrome\*" -DestinationPath "UIU-UCAM-Evaluation-Automator-v1.0.2.zip" -Force
Write-Host "[OK] Created Chrome package: UIU-UCAM-Evaluation-Automator-Chrome-v1.0.2.zip" -ForegroundColor Green

# Package Firefox Add-on
Compress-Archive -Path "firefox\*" -DestinationPath "UIU-UCAM-Evaluation-Automator-Firefox-v1.0.2.zip" -Force
Write-Host "[OK] Created Firefox package: UIU-UCAM-Evaluation-Automator-Firefox-v1.0.2.zip" -ForegroundColor Green

# Validate Firefox Add-on with addons-linter
Write-Host "Validating Firefox package with addons-linter..." -ForegroundColor Yellow
npx addons-linter "UIU-UCAM-Evaluation-Automator-Firefox-v1.0.2.zip"
