import type { Response } from "express";
import { env } from "../config/env.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.nodeEnv === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const setAuthCookie = (response: Response, token: string) => {
  response.cookie("token", token, cookieOptions);
};

export const clearAuthCookie = (response: Response) => {
  response.clearCookie("token", cookieOptions);
};
