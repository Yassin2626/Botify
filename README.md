# Botify - Discord Bot & Dashboard

A modular, multi-tier Discord bot with a fully functional web dashboard.

## 🚀 Quick Setup (Recommended)

**For first-time setup, use the automatic setup script:**

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all dependencies
- Create and configure your `.env` file with test credentials
- Generate Prisma client
- Guide you through database setup
- Get you ready to run `npm start`

---

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/windows/)
- **Redis** - [Download here](https://github.com/microsoftarchive/redis/releases) or use [Memurai](https://www.memurai.com/) (Redis alternative for Windows)
- **npm** (comes with Node.js)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL Database

1. Install and start PostgreSQL
2. Create a new database named `botify`:
   ```sql
   CREATE DATABASE botify;
   CREATE USER user WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE botify TO user;
   ```

### 3. Setup Redis

1. Install and start Redis (or Memurai for Windows)
2. Default configuration should work (localhost:6379)

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   - `DISCORD_TOKEN` - Get from [Discord Developer Portal](https://discord.com/developers/applications)
   - `DISCORD_CLIENT_ID` - Your Discord application's client ID
   - `DISCORD_CLIENT_SECRET` - Your Discord application's client secret
   - `NEXTAUTH_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Database and Redis URLs should work with default values if you followed the setup above

### 5. Initialize Database

Generate Prisma client and push the schema to your database:

```bash
npm run db:generate
npm run db:push
```

### 6. Start the Application

**Start everything (bot + dashboard):**
```bash
npm start
```

**Or start services individually:**
```bash
# Start only the bot
npm run bot

# Start only the dashboard  
npm run dashboard

# Use turbo to start both in dev mode
npm run dev
```

The dashboard will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Start both bot and dashboard concurrently
- `npm run dev` - Run both services in development mode with Turbo
- `npm run bot` - Start only the Discord bot
- `npm run dashboard` - Start only the web dashboard
- `npm run build` - Build all packages for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema to PostgreSQL
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run lint` - Run linting across all packages
- `npm run format` - Format code with Prettier

## Project Structure

```
├── apps/
│   ├── bot/          # Discord.js bot (TypeScript)
│   └── dashboard/    # Next.js 14 dashboard
├── packages/
│   └── database/     # Shared Prisma schema and client
└── package.json      # Root workspace configuration
```

## Troubleshooting

### Database Connection Issues

- Make sure PostgreSQL is running
- Verify your `DATABASE_URL` in `.env` matches your PostgreSQL configuration
- Check that the `botify` database exists

### Redis Connection Issues

- Verify Redis/Memurai is running
- Check that port 6379 is not blocked by firewall
- Ensure `REDIS_URL` in `.env` is correct

### Port Already in Use

- Dashboard uses port 3000 by default
- Make sure no other application is using this port
- You can change the port in `apps/dashboard` Next.js config if needed

### Discord Bot Not Connecting

- Verify your `DISCORD_TOKEN` is correct
- Make sure your bot has the necessary intents enabled in Discord Developer Portal
- Check that your bot is invited to your test server

## Development

This is a monorepo managed by npm workspaces and Turbo. Each package can be developed independently:

- **Bot**: Located in `apps/bot`, uses nodemon for hot reloading
- **Dashboard**: Located in `apps/dashboard`, uses Next.js dev server
- **Database**: Located in `packages/database`, contains Prisma schema

## Architecture

- **Bot**: Discord.js 14 + TypeScript + BullMQ for job queues
- **Dashboard**: Next.js 14 (App Router) + NextAuth + TailwindCSS
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis (via ioredis)
- **Communication**: Socket.io for real-time updates between bot and dashboard
