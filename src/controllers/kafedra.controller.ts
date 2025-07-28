import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Kafedra } from "../models";
import { sendSuccess } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";

// @router GET /api/kafedra
// @desc Barcha kafedralar
// @access Private
export const getAllKafedras = asyncHandler(
  async (req: Request, res: Response) => {
    const kafedralar = await Kafedra.findAll({
      order: [["id", "ASC"]],
    });
    return sendSuccess(res, {
      message: "Barcha kafedralar",
      data: kafedralar,
      statusCode: 200,
    });
  }
);

// @router GET /api/kafedra/:id
// @desc Kafedrani topish
// @access Private
export const getKafedra = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const kafedra = await Kafedra.findByPk(id);
  if (!kafedra) {
    throw new ApiError(404, "Kafedra topilmadi");
  }
  return sendSuccess(res, {
    message: "Kafedra topildi",
    data: kafedra,
    statusCode: 200,
  });
});

// @router DELETE /api/kafedra/:id
// @desc Kafedrani o'chirish
// @access Private
export const deleteKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const kafedra = await Kafedra.findByPk(id);
    if (!kafedra) {
      throw new ApiError(404, "Kafedra topilmadi");
    }
    await kafedra.destroy();
    return sendSuccess(res, {
      message: "Kafedra muvaffaqiyatli o‘chirildi",
      data: null,
      statusCode: 200,
    });
  }
);

// @router PUT /api/kafedra/:id
// @desc Kafedrani o'zgartirish
// @access Private
export const updateKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name_uz, name_ru } = req.body;

    if (!name_uz || !name_ru) {
      throw new ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }

    const kafedra = await Kafedra.findByPk(id);
    if (!kafedra) {
      throw new ApiError(404, "Kafedra topilmadi");
    }

    const existing = await Kafedra.findOne({
      where: { name_uz },
    });
    if (existing && existing.getDataValue("id") !== +id) {
      throw new ApiError(409, "Bu nomdagi kafedra allaqachon mavjud");
    }

    await kafedra.update({ name_uz, name_ru });

    return sendSuccess(res, {
      message: "Kafedra muvaffaqiyatli yangilandi",
      data: kafedra,
      statusCode: 200,
    });
  }
);

// @router POST /api/kafedra
// @desc Kafedra qo'shish
// @access Private
export const createKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const { name_uz, name_ru } = req.body;

    if (!name_uz || !name_ru) {
      throw new ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }

    const existing = await Kafedra.findOne({
      where: { name_uz },
    });
    if (existing) {
      throw new ApiError(409, "Bu nomdagi kafedra allaqachon mavjud");
    }

    const kafedra = await Kafedra.create({ name_uz, name_ru });

    return sendSuccess(res, {
      message: "Kafedra muvaffaqiyatli qo‘shildi",
      data: kafedra,
      statusCode: 201,
    });
  }
);
