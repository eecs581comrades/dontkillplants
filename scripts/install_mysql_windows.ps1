# Check if MySQL is installed, if not install it via Chocolatey
if (-Not (Get-Command mysql -ErrorAction SilentlyContinue)) {
    Write-Host "MySQL not found. Installing..."
    choco install mysql -y
    Start-Service mysql
} else {
    Write-Host "MySQL is already installed."
}