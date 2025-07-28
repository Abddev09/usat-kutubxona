import { Request, Response } from "express";
import { User } from "../models";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/responseHandler";

// @router GET /api/telegram/:id
// @desc Telegram userni topish
// @access Public
export const getTelegramUser = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const telegramUser = await User.findOne({
      where: { telegram_id: id },
    });

    if (!telegramUser) {
      throw new ApiError(404, "Telegram foydalanuvchisi topilmadi");
    }

    return sendSuccess(res, {
      message: "Telegram foydalanuvchisi topildi",
      data: telegramUser,
      statusCode: 200,
    });
  }
);

// @router Patch /api/step/:id
// @desc Telegram stepni o'zgartirish
// @access Public
export const updateTelegramStep = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { step } = req.body;
    const telegramUser = await User.findByPk(id);
    if (!telegramUser) {
      throw new ApiError(404, "Telegram user topilmadi");
    }
    await telegramUser.update({
      step,
    });
    return sendSuccess(res, {
      message: "Telegram step o'zgartirildi",
      data: telegramUser,
      statusCode: 200,
    });
  }
);

