# Botify - Discord Bot & Dashboard

A modular, multi-tier Discord bot with a fully functional web dashboard.

## Setup & Deployment

1.  **Prerequisites**:
    *   Docker & Docker Compose installed.
    *   Node.js 20+ (if running locally without Docker).

2.  **Configuration**:
    *   Create a `.env` file in the root directory (copy `.env.example` if it exists, or use the template below).

    ```env
    # Database
    DATABASE_URL="postgres://user:password@localhost:5432/botify"

    # Discord Bot
    DISCORD_TOKEN="your_discord_bot_token"
    DISCORD_CLIENT_ID="your_discord_client_id"

    # Dashboard
    NEXTAUTH_SECRET="super_secret_string"
    NEXTAUTH_URL="http://localhost:3000"
    DISCORD_CLIENT_SECRET="your_discord_client_secret"
    ```

3.  **Run with Docker**:
    ```bash
    docker compose up --build
    ```
    *   Bot will start.
    *   Dashboard will be available at `http://localhost:3000`.
    *   Postgres and Redis are handled automatically.

## Development

*   **Install Dependencies**: `npm install`
*   **Generate Prisma Client**: `npx turbo run db:generate`
*   **Run Dev**: `npx turbo run dev`

## Architecture

*   `apps/bot`: Discord.js + TypeScript bot.
*   `apps/dashboard`: Next.js 14 App Router dashboard.
*   `packages/database`: Shared Prisma schema and client.
