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
