import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Alphabet } from "../../models";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";

// @router GET /api/alphabet
// @desc Barcha Alphabets
// @access Public
export const getAllAlphabets = asyncHandler(
  async (req: Request, res: Response) => {
    const alphabets = await Alphabet.findAll();
    return sendSuccess(res, {
      message: "Barcha alifbo yozuvlari",
      data: alphabets,
      statusCode: 200,
    });
  }
);

// @router GET /api/alphabet/:id
// @desc Alphabetni topish
// @access Public
export const getAlphabet = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const alphabet = await Alphabet.findByPk(id);
  if (!alphabet) {
    throw new ApiError(404, "Alphabet topilmadi");
  }
  return sendSuccess(res, {
    message: "Alphabet topildi",
    data: alphabet,
    statusCode: 200,
  });
});

// @router POST /api/alphabet
// @desc Alphabet qo'shish
// @access Public
export const createAlphabet = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const exists = await Alphabet.findOne({ where: { name } });
    if (exists) {
      throw new ApiError(409, "Bu alphabet allaqachon mavjud");
    }
    const alphabet = await Alphabet.create({ name });
    return sendSuccess(res, {
      message: "Alphabet qo'shildi",
      data: alphabet,
      statusCode: 200,
    });
  }
);

// @router PUT /api/alphabet/:id
// @desc Alphabetni o'zgartirish
// @access Public
export const updateAlphabet = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name } = req.body;
    const alphabet = await Alphabet.findByPk(id);
    if (!alphabet) {
      throw new ApiError(404, "Alphabet topilmadi");
    }
    await alphabet.update({ name });
    return sendSuccess(res, {
      message: "Alphabet muvaffaqiyatli yangilandi",
      data: alphabet,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/alphabet/:id
// @desc Alphabetni o'chirish
// @access Public
export const deleteAlphabet = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const alphabet = await Alphabet.findByPk(id);
    if (!alphabet) {
      throw new ApiError(404, "Alphabet topilmadi");
    }
    await alphabet.destroy();
    return sendSuccess(res, {
      message: "Alphabet muvaffaqiyatli o'chirildi",
      data: alphabet,
      statusCode: 200,
    });
  }
);
