import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Yonalish, Kafedra } from "../models";
import { sendSuccess } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";

// @router GET /api/yonalish
// @desc Barcha yo‘nalishlar (kafedrasi bilan)
// @access Public
export const getAllYonalish = asyncHandler(
  async (req: Request, res: Response) => {
    const yonalishlar = await Yonalish.findAll({
      order: [["id", "ASC"]],
    });
    return sendSuccess(res, {
      message: "Barcha yo‘nalishlar kafedrasi bilan",
      data: yonalishlar,
      statusCode: 200,
    });
  }
);

// @router GET /api/yonalish/:id
// @desc Yonalishni topish
// @access Public
export const getYonalish = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const yonalish = await Yonalish.findByPk(id, {
    include: [
      {
        model: Kafedra,
        attributes: ["id", "name_uz", "name_ru"],
      },
    ],
  });
  if (!yonalish) {
    throw new ApiError(404, "Yonalish topilmadi");
  }
  return sendSuccess(res, {
    message: "Yonalish topildi",
    data: yonalish,
    statusCode: 200,
  });
});

// @router POST /api/yonalish
// @desc Yonalish qo'shish
// @access Private
export const createYonalish = asyncHandler(
  async (req: Request, res: Response) => {
    const { name_ru, name_uz } = req.body;

    // Takroriy yo‘nalish tekshirish
    const existing = await Yonalish.findOne({ where: { name_uz, name_ru } });
    if (existing) {
      throw new ApiError(409, "Bu yo‘nalish allaqachon mavjud");
    }

    const yonalish = await Yonalish.create({ name_ru, name_uz });

    return sendSuccess(res, {
      message: "Yonalish muvaffaqiyatli qo'shildi",
      data: yonalish,
      statusCode: 201,
    });
  }
);

// @router PUT /api/yonalish/:id
// @desc Yonalishni o'zgartirish
// @access Private
export const updateYonalish = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name_uz, name_ru, kafedra_id } = req.body;

    const yonalish = await Yonalish.findByPk(id);
    if (!yonalish) {
      throw new ApiError(404, "Yonalish topilmadi");
    }

    // Agar kafedra_id yuborilgan bo‘lsa, kafedrani ham tekshir
    if (kafedra_id) {
      const kafedra = await Kafedra.findByPk(kafedra_id);
      if (!kafedra) {
        throw new ApiError(404, "Kafedra topilmadi");
      }
    }

    await yonalish.update({ name_uz, name_ru, kafedra_id });

    return sendSuccess(res, {
      message: "Yonalish muvaffaqiyatli yangilandi",
      data: yonalish,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/yonalish/:id
// @desc Yonalishni o'chirish
// @access Private
export const deleteYonalish = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const yonalish = await Yonalish.findByPk(id);
    if (!yonalish) {
      throw new ApiError(404, "Yonalish topilmadi");
    }
    await yonalish.destroy();
    return sendSuccess(res, {
      message: "Yonalish muvaffaqiyatli o‘chirildi",
      data: yonalish,
      statusCode: 200,
    });
  }
);
