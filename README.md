# Botify - Discord Bot & Dashboard

A modular, multi-tier Discord bot with a fully functional web dashboard.

## Setup & Deployment

1.  **Prerequisites**:
    *   Docker & Docker Compose installed.
    *   Node.js 20+ (if running locally without Docker).

2.  **Configuration**:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open `.env` and fill in your values (Discord Token, Client ID, etc.).
    *   **Note**: The `.env` file is git-ignored to keep your secrets safe. Never commit it to GitHub.

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
