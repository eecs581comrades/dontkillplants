# Check if MySQL is installed, if not install it via Chocolatey
Write-Host "Checking MySQL status..."
if (-Not (Get-Command mysql -ErrorAction SilentlyContinue)) {
    Write-Host "MySQL not found. Installing..."
    choco install mysql -y
    Start-Service mysql
} else {
    Write-Host "MySQL is already installed."
}
