import type { NextFunction, Request, Response } from "express";
import { usersController } from "../controllers/users.js";

export const requiresAuth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.cookies?.token as string | undefined;
    if (!token) {
      response.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await usersController.getAuthUserFromToken(token);
    if (!user) {
      response.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
