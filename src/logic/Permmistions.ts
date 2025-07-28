import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Group, UserGroup, User } from "../models";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/responseHandler";

// @router  GET /api/user-groups
// @desc Barcha foydalanuvchilar
// @access Public
export const getAllUserGroups = asyncHandler(
  async (req: Request, res: Response) => {
    const userGroups = await UserGroup.findAll({
      include: [{ model: User }, { model: Group }],
    });
    if (!userGroups || userGroups.length === 0) {
      throw new ApiError(404, "Foydalanuvchilar topilmadi");
    }
    return sendSuccess(res, {
      message: "Barcha foydalanuvchilar",
      data: userGroups,
      statusCode: 200,
    });
  }
);
