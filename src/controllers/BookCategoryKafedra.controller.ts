import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/responseHandler";
import { Book, BookCategoryKafedra, Category, Kafedra } from "../models";

// @route GET /api/book-category-kafedra
// @desc Barchasini olish
// @access Public
export const getAllBookCategoryKafedras = asyncHandler(
  async (req: Request, res: Response) => {
    const all = await BookCategoryKafedra.findAll({
      order: [["id", "ASC"]],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name_uz", "name_ru"],
        },
        {
          model: Book,
          as: "book",
          attributes: ["id", "name"],
        },
        {
          model: Kafedra,
          as: "kafedra",
          attributes: ["id", "name_uz", "name_ru"],
        },
      ],
    });

    return sendSuccess(res, {
      message: "Barcha yozuvlar",
      data: all,
      statusCode: 200,
    });
  }
);

// @route GET /api/book-category-kafedra/:id
// @desc Bitta yozuvni olish
// @access Public
export const getBookCategoryKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await BookCategoryKafedra.findByPk(id);

    if (!item) throw new ApiError(404, "Yozuv topilmadi");

    return sendSuccess(res, {
      message: "Yozuv topildi",
      data: item,
      statusCode: 200,
    });
  }
);

// @route POST /api/book-category-kafedra
// @desc Yozuv qo‘shish
// @access Private
export const createBookCategoryKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const { category_id, kafedra_id } = req.body;

    if (!category_id || !kafedra_id) {
      throw new ApiError(400, "category_id va kafedra_id majburiy");
    }

    const created = await BookCategoryKafedra.create({
      category_id: Number(category_id),
      kafedra_id: Number(kafedra_id),
    });

    return sendSuccess(res, {
      message: "Yozuv yaratildi",
      data: created,
      statusCode: 201,
    });
  }
);

// @route PUT /api/book-category-kafedra/:id
// @desc Yozuvni yangilash
// @access Private
export const updateBookCategoryKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { category_id, kafedra_id } = req.body;

    const item = await BookCategoryKafedra.findByPk(id);
    if (!item) throw new ApiError(404, "Yozuv topilmadi");

    const updated = await item.update({
      category_id:
        category_id !== undefined
          ? Number(category_id)
          : item.getDataValue("category_id"),
      kafedra_id:
        kafedra_id !== undefined
          ? Number(kafedra_id)
          : item.getDataValue("kafedra_id"),
    });

    return sendSuccess(res, {
      message: "Yozuv yangilandi",
      data: updated,
      statusCode: 200,
    });
  }
);

// @route DELETE /api/book-category-kafedra/:id
// @desc Yozuvni o‘chirish
// @access Private
export const deleteBookCategoryKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await BookCategoryKafedra.findByPk(id);
    if (!item) throw new ApiError(404, "Yozuv topilmadi");

    await item.destroy();

    return sendSuccess(res, {
      message: "Yozuv muvaffaqiyatli o‘chirildi",
      data: null,
      statusCode: 200,
    });
  }
);
/**
 * GET /api/categories/:id/kafedralar
 * Shu kategoriya bo‘yicha bog‘langan kafedralar
 */
export const getCategoryKafedralar = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const kafedralar = await BookCategoryKafedra.findAll({
      where: { category_id: id },
      include: [
        {
          model: Kafedra,
          attributes: ["id", "name_uz", "name_ru"],
        },
      ],
    });

    const result = kafedralar.map((item) => ({
      kafedra_id: item.get("kafedra_id"),
      name_uz: (item as any).Kafedra?.name_uz,
      name_ru: (item as any).Kafedra?.name_ru,
    }));

    return sendSuccess(res, {
      message: "Kafedralar ro'yxati",
      data: result,
    });
  }
);

/**
 * GET /api/categories/:categoryId/kafedralar/:kafedraId/books
 * Shu kategoriya va kafedra bo‘yicha kitoblar
 */
export const getBooksByCategoryAndKafedra = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryId, kafedraId } = req.params;

    const books = await BookCategoryKafedra.findAll({
      where: {
        category_id: categoryId,
        kafedra_id: kafedraId,
      },
      include: [
        {
          model: Book,
          as: "book",
        },
      ],
    });

    const result = books.map((item) => {
      const book = (item as any).book;

      return {
        book_id: item.get("book_id"),
        book: book ? book.toJSON() : null,
      };
    });

    return sendSuccess(res, {
      message: "Kitoblar ro'yxati",
      data: result,
    });
  }
);
