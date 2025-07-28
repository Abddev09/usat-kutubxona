import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../middlewares/asyncHandler";
import { sendSuccess } from "../utils/responseHandler";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const siteLogin = asyncHandler(async (req: Request, res: Response) => {
  const { passport_id, password } = req.body;

  if (!passport_id || !password) {
    throw new ApiError(400, "Passport ID va parol majburiy");
  }

  // Foydalanuvchini qidirish
  const user = await User.findOne({
    where: { passport_id },
  });

  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }

  // Parolni tekshirish
  const isMatch = await bcrypt.compare(password, user.getDataValue("password"));
  if (!isMatch) {
    throw new ApiError(401, "Parol noto'g'ri");
  }

  // Token yaratish
  const token = jwt.sign(
    {
      id: user.getDataValue("id"),
      passport_id,
      role: "student", // Default sifatida student
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Javob yuborish
  return sendSuccess(res, {
    message: "Tizimga muvaffaqiyatli kirildi",
    data: {
      user: {
        id: user.getDataValue("id"),
        full_name: user.getDataValue("full_name"),
        phone: user.getDataValue("phone"),
        passport_id: user.getDataValue("passport_id"),
      },
      token,
    },
    statusCode: 200,
  });
});
