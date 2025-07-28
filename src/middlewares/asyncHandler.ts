// middlewares/asyncHandler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

// Har qanday async controller'ni o‘raydi va xatolikni next() bilan errorHandler ga yuboradi
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
