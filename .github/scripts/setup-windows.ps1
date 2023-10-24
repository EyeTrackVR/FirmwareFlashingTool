function SetupProject {
    Write-Host "Checking if Rustup is already installed" -ForegroundColor Green
    $rustup = Get-Command rustup -ErrorAction SilentlyContinue
    if ($rustup) {
        Write-Host "Rustup is already installed" -ForegroundColor Green
    }else{
        Write-Host "Installing Rustup" -ForegroundColor Blue
        winget install --id Rustlang.Rustup
    }
    Write-Host "Setting Rust Toolchain version" -ForegroundColor Green
    rustup default stable-msvc

    Write-Host "Checking if NodeJS is already installed" -ForegroundColor Green
    $nodejs = Get-Command node -ErrorAction SilentlyContinue

    if ($nodejs){
        Write-Host "NodeJS is already installed, continuing" -ForegroundColor Green
    }else{
        Write-Host "Installing NodeJS and NPM" -ForegroundColor Blue
        Invoke-WebRequest 'https://nodejs.org/dist/v18.16.1/node-v18.16.1-win-x64.zip' OutFile 'C:/nodejs.zip'
        Expand-Archive C:\nodejs.zip -DestinationPath C:\
        Rename-Item "C:\\node-v18.16.1-win-x64" C:\nodejs
        $Env:Path += ";C:\nodejs"
        Write-Host "Done" -ForegroundColor Green
    }

    Write-Host "Installing PNPM" -ForegroundColor Blue
    npm install -g pnpm

    Write-Host "Setup complete" -ForegroundColor Green
    
    Write-Host "Please follow the Tauri documentation for further information" -ForegroundColor Blue
    Start-Process "https://next--tauri.netlify.app/next/guides/getting-started/prerequisites/windows"
}

& SetupProject