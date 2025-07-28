import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Group } from "../models/Group";
import { sendSuccess } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";

// @router GET /api/groups
// @desc Barcha guruhlar
// @access Public
export const getAllGroups = asyncHandler(
  async (req: Request, res: Response) => {
    const groups = await Group.findAll();
    return sendSuccess(res, {
      message: "Barcha guruhlar",
      data: groups,
      statusCode: 200,
    });
  }
);
// @router GET /api/groups/:id
// @desc Guruhni topish
// @access Public
export const getGroup = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const group = await Group.findByPk(id);
  if (!group) {
    throw new ApiError(404, "Guruh topilmadi");
  }
  return sendSuccess(res, {
    message: "Guruh topildi",
    data: group,
    statusCode: 200,
  });
});
// @router POST /api/groups
// @desc Guruh qo'shish
// @access Public
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const { name, can_login } = req.body;

  const exists = await Group.findOne({ where: { name } });
  if (exists) {
    throw new ApiError(409, "Bu guruh allaqachon mavjud");
  }

  const lowercaseName = name.toLowerCase();

  const group = await Group.create({
    name: lowercaseName,
    can_login, 
  });

  return sendSuccess(res, {
    message: "Guruh muvaffaqiyatli qo'shildi",
    data: group,
    statusCode: 200,
  });
});

// @router DELETE /api/groups/:id
// @desc Guruhni o'chirish
// @access Public
export const deleteGroup = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const group = await Group.findByPk(id);
  if (!group) {
    throw new ApiError(404, "Guruh topilmadi");
  }
  await group.destroy();
  return sendSuccess(res, {
    message: "Guruh muvaffaqiyatli o'chirildi",
    data: group,
    statusCode: 200,
  });
});

// @router PUT /api/groups/:id
// @desc Guruhni o'zgartirish
// @access Public
export const updateGroup = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, can_login } = req.body;

  const group = await Group.findByPk(id);
  if (!group) {
    throw new ApiError(404, "Guruh topilmadi");
  }

  await group.update({
    name,
    can_login,
  });

  return sendSuccess(res, {
    message: "Guruh muvaffaqiyatli o'zgartirildi",
    data: group,
    statusCode: 200,
  });
});
