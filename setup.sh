#!/bin/bash

# Botify First-Time Setup Script for Linux/Mac
# Run this script with: bash setup.sh

echo "========================================"
echo "  Botify - First-Time Setup"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check Prerequisites
echo -e "${YELLOW}[1/7] Checking prerequisites...${NC}"

missing_prereqs=()

if ! command -v node &> /dev/null; then
    missing_prereqs+=("Node.js 20+")
fi

if ! command -v npm &> /dev/null; then
    missing_prereqs+=("npm")
fi

if ! command -v psql &> /dev/null; then
    echo -e "  ${YELLOW}⚠ PostgreSQL CLI not found in PATH. Make sure PostgreSQL is installed.${NC}"
fi

if [ ${#missing_prereqs[@]} -gt 0 ]; then
    echo -e "  ${RED}✗ Missing required software:${NC}"
    for prereq in "${missing_prereqs[@]}"; do
        echo -e "    ${RED}- $prereq${NC}"
    done
    echo ""
    echo -e "${RED}Please install the missing software and try again.${NC}"
    exit 1
fi

echo -e "  ${GREEN}✓ All prerequisites found!${NC}"
echo ""

# Install Dependencies
echo -e "${YELLOW}[2/7] Installing project dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "  ${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓ Dependencies installed successfully!${NC}"
echo ""

# Create .env file
echo -e "${YELLOW}[3/7] Creating environment configuration...${NC}"

if [ -f ".env" ]; then
    echo -e "  ${YELLOW}⚠ .env file already exists. Skipping creation.${NC}"
else
    # Generate a random NEXTAUTH_SECRET
    nextauth_secret=$(openssl rand -hex 32)
    
    cat > .env << EOF
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
NEXTAUTH_SECRET=$nextauth_secret

# Optional: API Keys for additional features
# Add any other environment variables your bot needs below
EOF

    echo -e "  ${GREEN}✓ .env file created with test credentials!${NC}"
fi
echo ""

# Database Setup Instructions
echo -e "${YELLOW}[4/7] Database setup instructions...${NC}"
echo -e "  Make sure PostgreSQL is running and execute:"
echo ""
echo -e "  ${CYAN}CREATE DATABASE botify;${NC}"
echo -e "  ${CYAN}CREATE USER user WITH PASSWORD 'password';${NC}"
echo -e "  ${CYAN}GRANT ALL PRIVILEGES ON DATABASE botify TO user;${NC}"
echo ""
echo -e "  ${YELLOW}Press Enter when database is ready, or type 'skip' to skip this step...${NC}"
read -r db_response

if [ "$db_response" != "skip" ]; then
    echo -e "  ${GREEN}✓ Database configured!${NC}"
else
    echo -e "  ${YELLOW}⚠ Database setup skipped. You'll need to configure it manually later.${NC}"
fi
echo ""

# Generate Prisma Client
echo -e "${YELLOW}[5/7] Generating Prisma client...${NC}"
npm run db:generate
if [ $? -ne 0 ]; then
    echo -e "  ${RED}✗ Failed to generate Prisma client${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓ Prisma client generated!${NC}"
echo ""

# Push Database Schema
echo -e "${YELLOW}[6/7] Pushing database schema...${NC}"
echo -e "  This will create all tables in your database."
read -p "  Continue? (y/n) " push_response

if [ "$push_response" == "y" ] || [ "$push_response" == "Y" ]; then
    npm run db:push
    if [ $? -ne 0 ]; then
        echo -e "  ${RED}✗ Failed to push database schema${NC}"
        echo -e "  ${RED}Make sure PostgreSQL is running and the database exists.${NC}"
        exit 1
    fi
    echo -e "  ${GREEN}✓ Database schema created!${NC}"
else
    echo -e "  ${YELLOW}⚠ Database schema push skipped.${NC}"
fi
echo ""

# Final Instructions
echo -e "${GREEN}[7/7] Setup complete!${NC}"
echo ""
echo "========================================"
echo "  Next Steps:"
echo "========================================"
echo ""
echo "1. Edit .env file and add your Discord bot token:"
echo -e "   ${CYAN}DISCORD_TOKEN=your_actual_token_here${NC}"
echo ""
echo "2. Make sure PostgreSQL and Redis are running"
echo ""
echo "3. Start the application:"
echo -e "   ${CYAN}npm start${NC}"
echo ""
echo -e "${YELLOW}For more information, see README.md${NC}"
echo ""
