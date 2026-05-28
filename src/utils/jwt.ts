import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload } from "../types/auth.js";

const TOKEN_TTL = "7d";

export const createAuthToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_TTL });

export const verifyAuthToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as unknown;

    if (
      typeof payload === "object" &&
      payload !== null &&
      typeof (payload as JwtPayload).sub === "number" &&
      typeof (payload as JwtPayload).username === "string"
    ) {
      return payload as JwtPayload;
    }

    return null;
  } catch {
    return null;
  }
};
