import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Auther } from "../../models";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";

// @router GET /api/authers
// @desc Barcha Yozuvchilar
// @access Public
export const getAllAuthers = asyncHandler(
  async (req: Request, res: Response) => {
    const authers = await Auther.findAll();
    return sendSuccess(res, {
      message: "Barcha yozuvchilar",
      data: authers,
      statusCode: 200,
    });
  }
);

// @router GET /api/authers/:id
// @desc Foydalanuvchini topish
// @access Public
export const getAuther = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const auther = await Auther.findByPk(id);
  if (!auther) {
    throw new ApiError(404, "Yozuvchi topilmadi");
  }
  return sendSuccess(res, {
    message: "Yozuvchi topildi",
    data: auther,
    statusCode: 200,
  });
});

// @router DELETE /api/authers/:id
// @desc Yozuvchi o'chirish
// @access Public
export const deleteAuther = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const auther = await Auther.findByPk(id);
    if (!auther) {
      throw new ApiError(404, "Yozuvchi topilmadi");
    }
    await auther.destroy();
    return sendSuccess(res, {
      message: "Yozuvchi muvaffaqiyatli o'chirildi",
      statusCode: 200,
    });
  }
);

// @router PUT /api/authers/:id
// @desc Yozuvchini o'zgartirish
// @access Public
export const updateAuther = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const auther = await Auther.findByPk(id);
    if (!auther) {
      throw new ApiError(404, "Yozuvchi topilmadi");
    }
    await auther.update({ name });
    return sendSuccess(res, {
      message: "Yozuvchi muvaffaqiyatli o'zgartirildi",
      data: auther,
      statusCode: 200,
    });
  }
);

// @router POST /api/authers
// @desc Yozuvchi qo'shish
// @access Public
export const createAuther = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const exists = await Auther.findOne({ where: { name } });
    if (exists) {
      throw new ApiError(409, "Bu yozuvchi allaqachon mavjud");
    }
    const auther = await Auther.create({ name });
    return sendSuccess(res, {
      message: "Yozuvchi qo'shildi",
      data: auther,
      statusCode: 200,
    });
  }
);
