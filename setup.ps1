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
Write-Host '[1/7] Checking prerequisites...' -ForegroundColor Yellow

$missingPrereqs = @()

if (-not (Test-Command 'node')) {
    $missingPrereqs += 'Node.js 20+'
}

if (-not (Test-Command 'npm')) {
    $missingPrereqs += 'npm'
}

if (-not (Test-Command 'psql')) {
    Write-Host '  ⚠ PostgreSQL CLI not found in PATH. Make sure PostgreSQL is installed.' -ForegroundColor DarkYellow
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
Write-Host '[2/7] Installing project dependencies...' -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host '  ✗ Failed to install dependencies' -ForegroundColor Red
    exit 1
}
Write-Host '  ✓ Dependencies installed successfully!' -ForegroundColor Green
Write-Host ''

# Create .env file
Write-Host '[3/7] Creating environment configuration...' -ForegroundColor Yellow

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

# Database Configuration
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://user:password@localhost:5432/botify

# Redis Configuration  
REDIS_URL=redis://localhost:6379

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

# Database Setup Instructions
Write-Host '[4/7] Database setup instructions...' -ForegroundColor Yellow
Write-Host '  Make sure PostgreSQL is running and execute:' -ForegroundColor White
Write-Host ''
Write-Host '  CREATE DATABASE botify;' -ForegroundColor Cyan
Write-Host '  CREATE USER user WITH PASSWORD ' -NoNewline -ForegroundColor Cyan
Write-Host "'password';" -ForegroundColor Cyan
Write-Host '  GRANT ALL PRIVILEGES ON DATABASE botify TO user;' -ForegroundColor Cyan
Write-Host ''
Write-Host '  Press Enter when database is ready, or type skip to skip this step...' -ForegroundColor DarkYellow
$dbResponse = Read-Host

if ($dbResponse -ne 'skip') {
    Write-Host '  ✓ Database configured!' -ForegroundColor Green
}
else {
    Write-Host '  ⚠ Database setup skipped. You will need to configure it manually later.' -ForegroundColor DarkYellow
}
Write-Host ''

# Generate Prisma Client
Write-Host '[5/7] Generating Prisma client...' -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host '  ✗ Failed to generate Prisma client' -ForegroundColor Red
    exit 1
}
Write-Host '  ✓ Prisma client generated!' -ForegroundColor Green
Write-Host ''

# Push Database Schema
Write-Host '[6/7] Pushing database schema...' -ForegroundColor Yellow
Write-Host '  This will create all tables in your database.' -ForegroundColor White
$pushResponse = Read-Host '  Continue? (y/n)'

if ($pushResponse -eq 'y' -or $pushResponse -eq 'Y') {
    npm run db:push
    if ($LASTEXITCODE -ne 0) {
        Write-Host '  ✗ Failed to push database schema' -ForegroundColor Red
        Write-Host '  Make sure PostgreSQL is running and the database exists.' -ForegroundColor Red
        exit 1
    }
    Write-Host '  ✓ Database schema created!' -ForegroundColor Green
}
else {
    Write-Host '  ⚠ Database schema push skipped.' -ForegroundColor DarkYellow
}
Write-Host ''

# Final Instructions
Write-Host '[7/7] Setup complete!' -ForegroundColor Green
Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  Next Steps:' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host '1. Edit .env file and add your Discord bot token:' -ForegroundColor White
Write-Host '   DISCORD_TOKEN=your_actual_token_here' -ForegroundColor Cyan
Write-Host ''
Write-Host '2. Make sure PostgreSQL and Redis are running' -ForegroundColor White
Write-Host ''
Write-Host '3. Start the application:' -ForegroundColor White
Write-Host '   npm start' -ForegroundColor Cyan
Write-Host ''
Write-Host 'For more information, see README.md' -ForegroundColor DarkGray
Write-Host ''
