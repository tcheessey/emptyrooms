import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  console.error(error);
  response.status(500).json({ success: false, message: "Internal server error" });
};
