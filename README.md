## Basics

- Backend: Express, Socket.IO, Knex, MySQL.
- Frontend: React, Vite, Socket.IO client.
- Database: MySQL from `docker-compose.yml`.
- Auth: HTTP-only cookie with a JWT.
- Live room state: sockets for presence and movement.
- Room rendering: PixiJS canvas component inside React.
- Durable game data: one user is one character; rooms define physical maps; live movement can stay in memory.

## Local Setup

1. Create `.env` from `.env.example`.
2. Start MySQL:

```sh
docker compose up -d db
```

3. Run migrations:

```sh
yarn migrate
```

4. Start the backend:

```sh
yarn start
```

5. Start the frontend:

```sh
cd frontend
yarn start
```

The frontend dev server proxies `/api` and `/socket.io` to the backend on port `5000`.

## Tests

Run unit tests from the repo root:

```sh
yarn test
```

The first tests use Vitest and cover small backend utilities. This keeps the test setup simple while the app architecture is still settling.

## Resetting the Dev DB

The migration history is intentionally clean while the schema is still early. If your local database already ran older migrations, reset the dev database before running `yarn migrate` again.

With the current Docker setup, the simplest reset is to remove the MySQL volume and start again.
