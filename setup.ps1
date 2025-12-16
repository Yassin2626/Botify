# Botify First-Time Setup Script for Windows
# Run this script with: .\setup.ps1

Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Botify - First-Time Setup' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

# Function to check if a command exists
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Check Prerequisites
Write-Host '[1/5] Checking prerequisites...' -ForegroundColor Yellow

$missingPrereqs = @()

if (-not (Test-Command 'node')) {
    $missingPrereqs += 'Node.js 20+'
}

if (-not (Test-Command 'npm')) {
    $missingPrereqs += 'npm'
}

if ($missingPrereqs.Count -gt 0) {
    Write-Host '  ✗ Missing required software:' -ForegroundColor Red
    foreach ($prereq in $missingPrereqs) {
        Write-Host "    - $prereq" -ForegroundColor Red
    }
    Write-Host ''
    Write-Host 'Please install the missing software and try again.' -ForegroundColor Red
    exit 1
}

Write-Host '  ✓ All prerequisites found!' -ForegroundColor Green
Write-Host ''

# Install Dependencies
Write-Host '[2/5] Installing project dependencies...' -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host '  ✗ Failed to install dependencies' -ForegroundColor Red
    exit 1
}
Write-Host '  ✓ Dependencies installed successfully!' -ForegroundColor Green
Write-Host ''

# Create .env file
Write-Host '[3/5] Creating environment configuration...' -ForegroundColor Yellow

if (Test-Path '.env') {
    Write-Host '  ⚠ .env file already exists. Skipping creation.' -ForegroundColor DarkYellow
}
else {
    # Generate a random NEXTAUTH_SECRET
    $nextAuthSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
    
    $envContent = @"
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=1450341877516865639
DISCORD_CLIENT_SECRET=tSK5jtq8HXXoDJznAmpd571K3xFJG-BP

# NextAuth Configuration (for Dashboard)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$nextAuthSecret

# Optional: API Keys for additional features
# Add any other environment variables your bot needs below
"@
    
    $envContent | Out-File -FilePath '.env' -Encoding utf8 -NoNewline
    Write-Host '  ✓ .env file created with test credentials!' -ForegroundColor Green
}
Write-Host ''

# Generate Prisma Client
Write-Host '[4/5] Generating Prisma client and setting up database...' -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host '  ✗ Failed to generate Prisma client' -ForegroundColor Red
    exit 1
}
Write-Host '  ✓ Prisma client generated!' -ForegroundColor Green
Write-Host ''

# Push Database Schema (automatic)
Write-Host '  Creating database tables...' -ForegroundColor Yellow
npm run db:push --workspace=@botify/database -- --accept-data-loss
if ($LASTEXITCODE -ne 0) {
    Write-Host '  ✗ Failed to create database schema' -ForegroundColor Red
    exit 1
}
Write-Host '  ✓ Database schema created!' -ForegroundColor Green
Write-Host ''

# Final Instructions
Write-Host '[5/5] Setup complete!' -ForegroundColor Green
Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Next Steps:' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host '1. Edit .env file and add your Discord bot token:' -ForegroundColor White
Write-Host '   DISCORD_TOKEN=your_actual_token_here' -ForegroundColor Cyan
Write-Host ''
Write-Host '2. Start the application:' -ForegroundColor White
Write-Host '   npm start' -ForegroundColor Cyan
Write-Host ''
Write-Host 'For more information, see README.md' -ForegroundColor DarkGray
Write-Host ''
