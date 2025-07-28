import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Book, BookItem, Category, Kafedra } from "../../models";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";

// @router GET /api/categories
// @desc Barcha kategoriyalar
// @access Public
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await Category.findAll({
      order: [["id", "ASC"]],
    });
    return sendSuccess(res, {
      message: "Barcha kategoriyalar",
      data: categories,
      statusCode: 200,
    });
  }
);

// @router GET /api/categories/:id
// @desc Kategoriyani topish
// @access Public
export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = await Category.findByPk(id);
  if (!category) {
    throw new ApiError(404, "Kategoriya topilmadi");
  }
  return sendSuccess(res, {
    message: "Kategoriya topildi",
    data: category,
    statusCode: 200,
  });
});

// @router POST /api/categories
// @desc Kategoriya qo'shish
// @access Public
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name_uz, name_ru, code } = req.body;

    if (!name_uz || !name_ru) {
      throw new ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }

    const existing = await Category.findOne({
      where: {
        name_uz,
        name_ru,
      },
    });
    if (existing) {
      throw new ApiError(409, "Bu nomdagi kategoriya allaqachon mavjud");
    }

    if (code) {
      const existingCode = await Category.findOne({
        where: { code },
      });
      if (existingCode) {
        throw new ApiError(409, "Bu koddagi kategoriya allaqachon mavjud");
      }
    }
    const category = await Category.create({ name_uz, name_ru, code });

    return sendSuccess(res, {
      message: "Kategoriya qo'shildi",
      data: category,
      statusCode: 201,
    });
  }
);

// @router PUT /api/categories/:id
// @desc Kategoriyani o'zgartirish
// @access Private
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { name_uz, name_ru } = req.body;

    if (!name_uz || !name_ru) {
      throw new ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }

    const category = await Category.findByPk(id);
    if (!category) {
      throw new ApiError(404, "Kategoriya topilmadi");
    }

    const existing = await Category.findOne({
      where: { name_uz },
    });
    if (existing && existing.getDataValue("id") !== +id) {
      throw new ApiError(409, "Bu nomdagi kategoriya allaqachon mavjud");
    }

    await category.update({ name_uz, name_ru });

    return sendSuccess(res, {
      message: "Kategoriya yangilandi",
      data: category,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/categories/:id
// @desc Kategoriyani o'chirish
// @access Private
export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const category = await Category.findByPk(id);
    if (!category) {
      throw new ApiError(404, "Kategoriya topilmadi");
    }
    await category.destroy();
    return sendSuccess(res, {
      message: "Kategoriya o'chirildi",
      data: null,
      statusCode: 200,
    });
  }
);

// @router GET /api/telegram/category/:id
// @desc Kitoblarni kategoriya va kafedra bo'yicha olish
// @access Public
export const getBooksByCategoryAndKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.id, 10);
    const kafedraId = req.query.kafedraId
      ? parseInt(String(req.query.kafedraId), 10)
      : undefined;

    if (isNaN(categoryId)) {
      throw new ApiError(400, "Kategoriya ID son bo‘lishi kerak");
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new ApiError(404, "Kategoriya topilmadi");
    }

    if (kafedraId) {
      const kafedra = await Kafedra.findByPk(kafedraId);
      if (!kafedra) {
        throw new ApiError(404, "Kafedra topilmadi");
      }
    }

    const books = await Book.findAll({
      include: [
        {
          model: Category,
          as: "categories",
          where: { id: categoryId },
          attributes: ["id", "name_uz", "name_ru"],
          through: { attributes: [] },
        },
        {
          model: BookItem,
          include: [
            {
              model: Kafedra,
              attributes: ["id", "name_uz", "name_ru"],
            },
          ],
          required: kafedraId ? true : false,
          where: kafedraId ? { kafedra_id: kafedraId } : undefined,
        },
      ],
      order: [["id", "ASC"]],
    });

    return sendSuccess(res, {
      message: "Mos kitoblar ro‘yxati",
      data: books,
      statusCode: 200,
    });
  }
);
