import dotenv from "dotenv";

dotenv.config();

const requiredVars = ["DB_HOST", "DB_NAME", "DB_USER", "JWT_SECRET"] as const;

for (const variableName of requiredVars) {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  jwtSecret: process.env.JWT_SECRET as string,
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
};
