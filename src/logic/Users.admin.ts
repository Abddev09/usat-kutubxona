import { Request, Response } from "express";
import { Group, StudentGroup, User, Yonalish } from "../models";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/responseHandler";

// @desc Barcha userlarni chiqarish (yo'nalish, kafedra va guruh bilan)
// @route GET /api/users
// @access Public
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.findAll({
    include: [
      {
        model: StudentGroup,
        include: [
          {
            model: Yonalish,
          },
        ],
      },
      {
        model: Group,
        as: "groups", // <-- alias qo‘shiladi
        through: { attributes: [] },
      },
    ],
  });

  if (!users) throw new ApiError(404, "Foydalanuvchilar topilmadi");

  return sendSuccess(res, {
    message: "Foydalanuvchilar ro'yxati",
    data: users,
    statusCode: 200,
  });
});
