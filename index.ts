import http from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { env } from "./src/config/env.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { roomsRouter } from "./src/routes/rooms.js";
import { usersRouter } from "./src/routes/users.js";
import { setSockets } from "./src/socket.js";

export const app = express();

app.disable("etag");
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", usersRouter);
app.use("/api", roomsRouter);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.clientOrigin,
    credentials: true,
  },
});

setSockets(io);

server.listen(env.port);
