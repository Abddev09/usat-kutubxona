// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ValidationError } from "sequelize";
import { ApiError } from "../utils/ApiError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("❌ Xatolik:", err);

  // 1️⃣ Zod validatsiya xatosi
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validatsiya xatoligi",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // 2️⃣ Sequelize unique constraint (masalan: phone yoki passport_id takroran kiritilsa)
  if (err.name === "SequelizeUniqueConstraintError") {
    const sequelizeErr = err as ValidationError;
    res.status(409).json({
      success: false,
      message: "Ma'lumot allaqachon mavjud",
      errors: sequelizeErr.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  // 3️⃣ ApiError (biz o‘zimiz `throw new ApiError(...)` qilganmiz)
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
    return;
  }

  // 4️⃣ Default fallback
  res.status(500).json({
    success: false,
    message: "Ichki server xatoligi",
    error: err.message || "Noma’lum xatolik yuz berdi",
  });
};

export default errorHandler;
