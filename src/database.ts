import knex, { type Knex } from "knex";
import { env } from "./config/env.js";

const environment = env.nodeEnv === "production" ? "production" : "development";

const dbConfig: Knex.Config =
  environment === "production"
    ? {
        client: "mysql2",
        connection: process.env.JAWSDB_URL,
      }
    : {
        client: "mysql2",
        connection: {
          port: Number(process.env.DB_PORT ?? 3306),
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD || "",
        },
      };

export const db = knex.knex(dbConfig);
