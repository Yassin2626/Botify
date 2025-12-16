# Botify - Discord Bot & Dashboard

A modular Discord bot with a fully functional web dashboard.

## 🚀 Quick Setup (30 seconds!)

**Windows (PowerShell):**
```powershell
powershell.exe -ExecutionPolicy Bypass -File .\setup.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x setup.sh
./setup.sh
```

The automated setup script will:
- ✅ Install all dependencies
- ✅ Create `.env` file with default configuration
- ✅ Generate Prisma client
- ✅ Create SQLite database with all tables
- ✅ Get you ready to run `npm start` in 30 seconds

**No PostgreSQL or Redis installation required for local development!**

---

## Prerequisites

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

That's it! The setup script handles everything else.

---

## Quick Start

### 1. Run the Setup Script

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\setup.ps1
```

### 2. Add Your Discord Bot Token

Edit `.env` and add your Discord bot token:
```env
DISCORD_TOKEN=your_actual_discord_bot_token_here
```

Get your token from the [Discord Developer Portal](https://discord.com/developers/applications).

### 3. Start the Application

```bash
npm start
```

🎉 **Done!** The bot and dashboard are now running:
- **Bot**: Connected to Discord
- **Dashboard**: http://localhost:3000

---

## Available Scripts

- `npm start` - Start both bot and dashboard concurrently
- `npm run bot` - Start only the Discord bot
- `npm run dashboard` - Start only the web dashboard
- `npm run dev` - Run both services in development mode with Turbo
- `npm run build` - Build all packages for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run lint` - Run linting across all packages
- `npm run format` - Format code with Prettier

---

## Project Structure

```
├── apps/
│   ├── bot/          # Discord.js bot (TypeScript)
│   └── dashboard/    # Next.js 14 dashboard
├── packages/
│   └── database/     # Shared Prisma schema (SQLite)
└── package.json      # Root workspace configuration
```

---

## Troubleshooting

### Issue: Setup script fails

**Solution:** Make sure Node.js 20+ is installed:
```bash
node --version
```

### Issue: Bot says "No token found"

**Solution:** Edit `.env` and add your Discord bot token:
```env
DISCORD_TOKEN=your_actual_token_here
```

Then restart: `npm start`

### Issue: Port 3000 already in use

**Solution:** Kill the process using port 3000 or change the dashboard port in `apps/dashboard`.

### Issue: Want to use PostgreSQL instead of SQLite?

**Solution:** 
1. Edit `packages/database/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Add `DATABASE_URL` to `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/botify
   ```
3. Run `npm run db:push`

---

## Development

This is a monorepo managed by npm workspaces and Turbo:

- **Bot**: Located in `apps/bot`, uses nodemon for hot reloading
- **Dashboard**: Located in `apps/dashboard`, uses Next.js dev server
- **Database**: Located in `packages/database`, SQLite for local dev

---

## Tech Stack

- **Bot**: Discord.js 14 + TypeScript
- **Dashboard**: Next.js 14 (App Router) + NextAuth + TailwindCSS
- **Database**: SQLite (local) / PostgreSQL (production) + Prisma ORM
- **Cache**: Redis (optional)

---

## License

MIT
