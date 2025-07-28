import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { UserInstance } from "../types/models";

export interface AuthenticatedRequest extends Request {
  user?: UserInstance;
}

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("🔐 AUTH MIDDLEWARE ISHLADI!");
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Token topilmadi");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string | number;
    };

    const userId = Number(decoded.id);
    if (isNaN(userId)) {
      throw new ApiError(401, "Token noto‘g‘ri");
    }

    const user = (await User.findOne({
      where: { id: decoded.id },
    })) as UserInstance;
    if (!user) throw new ApiError(401, "Foydalanuvchi topilmadi");

    req.user = user;
    next();
  } catch (err: unknown) {
    if (err instanceof ApiError) return next(err);

    if (err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, "Token muddati tugagan"));
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, "Token noto‘g‘ri"));
    }

    return next(new ApiError(500, "Noma'lum xatolik"));
  }
};
