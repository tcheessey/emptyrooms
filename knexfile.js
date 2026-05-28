import dotenv from "dotenv";
dotenv.config();
export default {
  development: {
    client: "mysql2",
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
    },
  },
  production: {
    client: "mysql2",
    connection: process.env.JAWSDB_URL,
  },
};
