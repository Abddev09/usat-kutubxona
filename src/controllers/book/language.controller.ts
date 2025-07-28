import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Language } from "../../models";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";

// @router GET /api/languages
// @desc Barcha til
// @access Public
export const getAllLanguages = asyncHandler(
  async (req: Request, res: Response) => {
    const languages = await Language.findAll();
    return sendSuccess(res, {
      message: "Barcha til",
      data: languages,
      statusCode: 200,
    });
  }
);

// @router GET /api/languages/:id
// @desc Tilni topish
// @access Public
export const getLanguage = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const language = await Language.findByPk(id);
  if (!language) {
    throw new ApiError(404, "Til topilmadi");
  }
  return sendSuccess(res, {
    message: "Til topildi",
    data: language,
    statusCode: 200,
  });
});

// @router POST /api/languages
// @desc Til qo'shish
// @access Private
export const createLanguage = asyncHandler(
  async (req: Request, res: Response) => {
    const language = await Language.create(req.body);
    return sendSuccess(res, {
      message: "Til muvaffaqiyatli qo'shildi",
      data: language,
      statusCode: 200,
    });
  }
);

// @router PUT /api/languages/:id
// @desc Tilni o'zgartirish
// @access Private
export const updateLanguage = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const language = await Language.findByPk(id);
    if (!language) {
      throw new ApiError(404, "Til topilmadi");
    }
    await language.update(req.body);
    return sendSuccess(res, {
      message: "Til muvaffaqiyatli o'zgartirildi",
      data: language,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/languages/:id
// @desc Tilni o'chirish
// @access Private
export const deleteLanguage = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const language = await Language.findByPk(id);
    if (!language) {
      throw new ApiError(404, "Til topilmadi");
    }
    await language.destroy();
    return sendSuccess(res, {
      message: "Til muvaffaqiyatli o'chirildi",
      data: language,
      statusCode: 200,
    });
  }
);
