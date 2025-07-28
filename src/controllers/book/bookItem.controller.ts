import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import {
  Alphabet,
  Auther,
  Book,
  BookCategoryKafedra,
  BookItem,
  Category,
  Kafedra,
  Language,
  Status,
} from "../../models";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";
import { uploadPDF } from "../../middlewares/upload";
import { PDFFile } from "../../models/book/pdfFile";
import { ImageFile } from "../../models/book/imageFile";

// @router GET /api/bookItems
// @desc Barcha kitoblar
// @access Public
export const getAllBookItems = asyncHandler(
  async (req: Request, res: Response) => {
    const bookItems = await BookItem.findAll({
      include: [
        {
          model: Book,
          include: [
            {
              model: Auther,
            },
            {
              model: ImageFile,
              as: "image",
            },
          ],
        },
        {
          model: Language,
        },
        {
          model: Alphabet,
        },
        {
          model: Status,
        },
        {
          model: PDFFile,
          attributes: ["id", "file_url", "original_name", "file_size"],
        },
        {
          model: BookCategoryKafedra,
          as: "BookCategoryKafedra",
          attributes: ["category_id", "kafedra_id"],
          include: [
            {
              model: Category,
              as: "category",
              attributes: ["id", "name_uz", "name_ru"],
            },
            {
              model: Kafedra,
              as: "kafedra",
              attributes: ["id", "name_uz", "name_ru"],
            },
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    return sendSuccess(res, {
      message: "Barcha kitoblar",
      data: bookItems,
      statusCode: 200,
    });
  }
);

// @router GET /api/bookItems/:id
// @desc Kitobni topish
// @access Public
export const getBookItem = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const bookItem = await BookItem.findByPk(id);
  if (!bookItem) {
    throw new ApiError(404, "Kitob topilmadi");
  }
  return sendSuccess(res, {
    message: "Kitob topildi",
    data: bookItem,
    statusCode: 200,
  });
});

// @router POST /api/bookItems
// @desc Kitob qo'shish
// @access Private
export const createBookItem = [
  uploadPDF.single("pdf"),

  asyncHandler(async (req: Request, res: Response) => {
    const {
      book_id,
      language_id,
      alphabet_id,
      status_id,
      category_id,
      kafedra_id,
    } = req.body;

    // Majburiy maydonlarni tekshirish
    if (
      !book_id ||
      !language_id ||
      !alphabet_id ||
      !category_id ||
      !kafedra_id
    ) {
      throw new ApiError(
        400,
        "Majburiy maydonlar (book_id, language_id, alphabet_id, category_id, kafedra_id) to'ldirilishi shart"
      );
    }

    // Agar fayl kelmagan bo'lsa
    if (!req.file) {
      throw new ApiError(400, "PDF fayl yuborilishi shart");
    }

    // PDF faylni alohida jadvalga yozish
    const pdfFile = await PDFFile.create({
      file_url: `${process.env.BASE_URL}/uploads/pdfs/${req.file.filename}`,
      file_size: req.file.size,
      original_name: req.file.originalname,
    });

    // BookItem yaratish
    const bookItem = await BookItem.create({
      book_id: Number(book_id),
      language_id: Number(language_id),
      alphabet_id: Number(alphabet_id),
      status_id: status_id !== undefined ? Number(status_id) : null,
      pdf_id: pdfFile.getDataValue("id"),
    });
    // BookCategoryKafedra orqali kitobni kategoriya va kafedraga bog'lash
    await BookCategoryKafedra.findOrCreate({
      where: {
        book_id: bookItem.getDataValue("id"),
        category_id: Number(category_id),
        kafedra_id: Number(kafedra_id),
      },
    });
    return sendSuccess(res, {
      message: "Kitob muvaffaqiyatli qo'shildi",
      data: bookItem,
      statusCode: 201,
    });
  }),
];

// @router PUT /api/bookItems/:id
// @desc Kitobni yangilash
// @access Private
export const updateBookItem = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const bookItem = await BookItem.findByPk(id);

    if (!bookItem) {
      throw new ApiError(404, "Kitob topilmadi");
    }

    // Faqat yuborilgan maydonlarni ajratib olish
    const updateData: Partial<{
      book_id: number;
      language_id: number;
      alphabet_id: number;
      status_id: number;
      pdf_url: string;
    }> = {};

    const { book_id, language_id, alphabet_id, status_id, pdf_url } = req.body;

    if (book_id !== undefined) updateData.book_id = book_id;
    if (language_id !== undefined) updateData.language_id = language_id;
    if (alphabet_id !== undefined) updateData.alphabet_id = alphabet_id;
    if (status_id !== undefined) updateData.status_id = status_id;

    if (pdf_url !== undefined) updateData.pdf_url = pdf_url;

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "Hech bo‘lmasa bitta maydon yuboring");
    }

    await bookItem.update(updateData);

    return sendSuccess(res, {
      message: "Kitob muvaffaqiyatli yangilandi",
      data: bookItem,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/bookItems/:id
// @desc Kitobni o'chirish
// @access Private
export const deleteBookItem = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const bookItem = await BookItem.findByPk(id);

    if (!bookItem) {
      throw new ApiError(404, "Kitob topilmadi");
    }

    await bookItem.destroy();

    return sendSuccess(res, {
      message: "Kitob muvaffaqiyatli o'chirildi",
      data: bookItem,
      statusCode: 200,
    });
  }
);
