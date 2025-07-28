import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";
import { BookCategory } from "../../models";

// @router GET /api/bookCategories
// @desc Barcha kategoriyalar
// @access Public
export const getAllBookCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await BookCategory.findAll();
    return sendSuccess(res, {
      message: "Barcha kategoriyalar",
      data: categories,
      statusCode: 200,
    });
  }
);

// @router GET /api/bookCategories/:id
// @desc Kategoriyani topish
// @access Public
export const getBookCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = await BookCategory.findByPk(id);
    if (!category) {
      throw new ApiError(404, "Kategoriya topilmadi");
    }
    return sendSuccess(res, {
      message: "Kategoriya topildi",
      data: category,
      statusCode: 200,
    });
  }
);

// @router POST /api/bookCategories
// @desc Kategoriyani yaratish
// @access Private
export const createBookCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const bookCategody = await BookCategory.create(req.body);
    return sendSuccess(res, {
      message: "Kategoriya muvaffaqiyatli yaratildi",
      data: bookCategody,
      statusCode: 200,
    });
  }
);

// @router PUT /api/bookCategories/:id
// @desc Kategoriyani o'zgartirish
// @access Private
export const updateBookCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const category = await BookCategory.findByPk(id);
    if (!category) {
      throw new ApiError(404, "Kategoriya topilmadi");
    }
    await category.update({ name });
    return sendSuccess(res, {
      message: "Kategoriya muvaffaqiyatli yangilandi",
      data: category,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/bookCategories/:id
// @desc Kategoriyani o'chirish
// @access Private
export const deleteBookCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = await BookCategory.findByPk(id);
    if (!category) {
      throw new ApiError(404, "Kategoriya topilmadi");
    }
    await category.destroy();
    return sendSuccess(res, {
      message: "Kategoriya muvaffaqiyatli o'chirildi",
      data: category,
      statusCode: 200,
    });
  }
);
