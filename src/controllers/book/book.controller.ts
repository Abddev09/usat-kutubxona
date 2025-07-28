import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler";
import { Auther, Book, BookItem } from "../../models";
import { sendSuccess } from "../../utils/responseHandler";
import { ApiError } from "../../utils/ApiError";
import { ImageFile } from "../../models/book/imageFile";
import fs from "fs";

// @router GET /api/books
// @desc Barcha kitoblar
// @access Public
export const getAllBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await Book.findAll({
    include: [
      {
        model: Auther,
        as: "Auther",
        attributes: ["id", "name"],
      },
      {
        model: ImageFile,
        as: "image",
        attributes: ["id", "url"], // Istasang filename, size, mimetype ham qo'sh
      },
    ],
  });

  return sendSuccess(res, {
    message: "Barcha kitoblar",
    data: books,
    statusCode: 200,
  });
});

// @router GET /api/books/:id
// @desc Kitobni topish
// @access Public
export const getBook = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  const book = await Book.findByPk(id, {
    include: [
      {
        model: Auther,
        as: "Auther",
        attributes: ["id", "name"],
      },
      {
        model: ImageFile,
        as: "image",
        attributes: ["id", "url"],
      },
      {
        model: BookItem,
        as: "BookItems",
      },
    ],
  });

  if (!book) {
    throw new ApiError(404, "Kitob topilmadi");
  }

  return sendSuccess(res, {
    message: "Kitob topildi",
    data: book,
    statusCode: 200,
  });
});

// @router POST /api/books
// @desc Kitob qo'shish
// @access Private
export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const { name, author_id, year, page, books, book_count, description } =
    req.body;

  let imageId = null;

  if (req.file) {
    const image = await ImageFile.create({
      filename: req.file.filename,
      path: req.file.path,
      url: `/uploads/book-images/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    imageId = image.id;
  }

  const book = await Book.create({
    name,
    author_id,
    year,
    page,
    book_count,
    description,
    books,
    image_id: imageId,
  });

  return sendSuccess(res, {
    message: "Kitob qo'shildi",
    data: book,
    statusCode: 201,
  });
});

// @router PUT /api/books/:id
// @desc Kitobni o'zgartirish
// @access Private
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const book = await Book.findByPk(id);

  if (!book) {
    throw new ApiError(404, "Kitob topilmadi");
  }

  const { name, author_id, year, page, books, book_count, description } =
    req.body;

  let imageId = book.getDataValue("image_id");

  if (req.file) {
    // Eski rasmni bazadan topamiz
    const oldImage = imageId ? await ImageFile.findByPk(imageId) : null;

    // Eski rasm faylini o‘chirish
    if (oldImage && fs.existsSync(oldImage.path)) {
      fs.unlinkSync(oldImage.path);
    }

    // Yangi rasmni yaratish
    const newImage = await ImageFile.create({
      filename: req.file.filename,
      path: req.file.path,
      url: `/uploads/book-images/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    imageId = newImage.id;
  }

  // Kitobni yangilash
  await book.update({
    name,
    author_id,
    year,
    page,
    books,
    book_count,
    description,
    image_id: imageId,
  });

  return sendSuccess(res, {
    message: "Kitob muvaffaqiyatli yangilandi",
    data: book,
    statusCode: 200,
  });
});

// @router DELETE /api/books/:id
// @desc Kitobni o'chirish
// @access Private
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const book = await Book.findByPk(id);
  if (!book) {
    throw new ApiError(404, "Kitob topilmadi");
  }
  await book.destroy();
  return sendSuccess(res, {
    message: "Kitob muvaffaqiyatli o'chirildi",
    data: book,
    statusCode: 200,
  });
});
