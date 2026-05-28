import type { NextFunction, Request, Response } from "express";

type AsyncRoute = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  (handler: AsyncRoute) =>
  (request: Request, response: Response, next: NextFunction) => {
    handler(request, response, next).catch(next);
  };
