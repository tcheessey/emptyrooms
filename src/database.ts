import { knex } from "knex";
import knexfile from "../knexfile.js";
import { env } from "./config/env.js";

const environment = env.nodeEnv === "production" ? "production" : "development";

export const db = knex(knexfile[environment]);
