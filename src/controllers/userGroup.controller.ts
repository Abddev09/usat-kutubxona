import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Group } from "../models/Group";
import { User } from "../models/User";
import { UserGroup } from "../models/UserGroup";
import { sendSuccess } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";

// @router GET /api/user-groups
// @desc Barcha foydalanuvchilar
// @access Public
export const getAllUserGroups = asyncHandler(
  async (req: Request, res: Response) => {
    const userGroups = await UserGroup.findAll();
    return sendSuccess(res, {
      message: "Barcha foydalanuvchilar",
      data: userGroups,
      statusCode: 200,
    });
  }
);
// @router GET /api/user-groups/:id
// @desc Foydalanuvchini topish
// @access Public
export const getUserGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userGroup = await UserGroup.findByPk(id);
    if (!userGroup) {
      throw new ApiError(404, "Foydalanuvchi topilmadi");
    }
    return sendSuccess(res, {
      message: "Foydalanuvchi topildi",
      data: userGroup,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/user-groups/:id
// @desc Foydalanuvchini o'chirish
// @access Public
export const deleteUserGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const userGroup = await UserGroup.findByPk(id);
    if (!userGroup) {
      throw new ApiError(404, "Foydalanuvchi topilmadi");
    }
    await userGroup.destroy();
    return sendSuccess(res, {
      message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
      data: userGroup,
      statusCode: 200,
    });
  }
);

// @router POST /api/user-groups
// @desc Foydalanuvchini qo'shish
// @access Public
export const createUserGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const { user_id, group_id } = req.body;

    // 1. Duplikat bor-yo'qligini tekshirish
    const exists = await UserGroup.findOne({ where: { user_id, group_id } });
    if (exists) {
      throw new ApiError(
        409,
        "Bu foydalanuvchi ushbu guruhga allaqachon biriktirilgan"
      );
    }

    // 2. User va Group parallel tekshirish (tezroq ishlaydi)
    const [user, group] = await Promise.all([
      User.findByPk(user_id),
      Group.findByPk(group_id),
    ]);

    if (!user) throw new ApiError(404, "Foydalanuvchi topilmadi");
    if (!group) throw new ApiError(404, "Guruh topilmadi");

    // 3. Biriktirish
    const userGroup = await UserGroup.create({ user_id, group_id });

    return sendSuccess(res, {
      message: "Foydalanuvchi guruhga muvaffaqiyatli qo'shildi",
      data: userGroup,
      statusCode: 201,
    });
  }
);

// @router PUT /api/user-groups/:id
// @desc Foydalanuvchini o'zgartirish
// @access Public
export const updateUserGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { user_id, group_id } = req.body;
    const userGroup = await UserGroup.findByPk(id);
    if (!userGroup) {
      throw new ApiError(404, "Foydalanuvchi topilmadi");
    }
    await userGroup.update({
      user_id,
      group_id,
    });
    return sendSuccess(res, {
      message: "Foydalanuvchi muvaffaqiyatli o'zgartirildi",
      data: userGroup,
      statusCode: 200,
    });
  }
);
