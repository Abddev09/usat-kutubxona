import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Permission } from "../models/Permission";
import { sendSuccess } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";

// @router GET /api/permissions
// @desc Barcha foydalanuvchilar
// @access Public
export const getAllPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const permissions = await Permission.findAll();
    return sendSuccess(res, {
      message: "Barcha Ruxsatlar",
      data: permissions,
      statusCode: 200,
    });
  }
);

// @router GET /api/permissions/:id
// @desc Foydalanuvchini topish
// @access Public
export const getPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new ApiError(404, "Ruxsat topilmadi");
    }
    return sendSuccess(res, {
      message: "Ruxsat topildi",
      data: permission,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/permissions/:id
// @desc Foydalanuvchini o'chirish
// @access Public
export const deletePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new ApiError(404, "Ruxsat topilmadi");
    }
    await permission.destroy();
    return sendSuccess(res, {
      message: "Ruxsat muvaffaqiyatli o‘chirildi",
      data: permission,
      statusCode: 200,
    });
  }
);

// @router PUT /api/permissions/:id
// @desc Foydalanuvchini o'zgartirish
// @access Public
export const updatePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { code_name, name, table } = req.body;
    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new ApiError(404, "Ruxsat topilmadi");
    }
    await permission.update({
      code_name,
      name,
      table,
    });
    return sendSuccess(res, {
      message: "Ruxsat muvaffaqiyatli o‘zgartirildi",
      data: permission,
      statusCode: 200,
    });
  }
);

// @router POST /api/permissions
// @desc Foydalanuvchini yaratish
// @access Public
export const createPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const { code_name, name, table } = req.body;
    const permission = await Permission.create({
      code_name,
      name,
      table,
    });
    return sendSuccess(res, {
      message: "Ruxsat muvaffaqiyatli yaratildi",
      data: permission,
      statusCode: 200,
    });
  }
);
