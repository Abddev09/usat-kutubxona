"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getAllBooks = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const models_1 = require("../../models");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
const imageFile_1 = require("../../models/book/imageFile");
const fs_1 = __importDefault(require("fs"));
// @router GET /api/books
// @desc Barcha kitoblar
// @access Public
exports.getAllBooks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const books = await models_1.Book.findAll({
        include: [
            {
                model: models_1.Auther,
                as: "Auther",
                attributes: ["id", "name"],
            },
            {
                model: imageFile_1.ImageFile,
                as: "image",
                attributes: ["id", "url"], // Istasang filename, size, mimetype ham qo'sh
            },
        ],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha kitoblar",
        data: books,
        statusCode: 200,
    });
});
// @router GET /api/books/:id
// @desc Kitobni topish
// @access Public
exports.getBook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const book = await models_1.Book.findByPk(id, {
        include: [
            {
                model: models_1.Auther,
                as: "Auther",
                attributes: ["id", "name"],
            },
            {
                model: imageFile_1.ImageFile,
                as: "image",
                attributes: ["id", "url"],
            },
            {
                model: models_1.BookItem,
                as: "BookItems",
            },
        ],
    });
    if (!book) {
        throw new ApiError_1.ApiError(404, "Kitob topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob topildi",
        data: book,
        statusCode: 200,
    });
});
// @router POST /api/books
// @desc Kitob qo'shish
// @access Private
exports.createBook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, author_id, year, page, books, book_count, description } = req.body;
    let imageId = null;
    if (req.file) {
        const image = await imageFile_1.ImageFile.create({
            filename: req.file.filename,
            path: req.file.path,
            url: `/uploads/book-images/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size,
        });
        imageId = image.id;
    }
    const book = await models_1.Book.create({
        name,
        author_id,
        year,
        page,
        book_count,
        description,
        books,
        image_id: imageId,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob qo'shildi",
        data: book,
        statusCode: 201,
    });
});
// @router PUT /api/books/:id
// @desc Kitobni o'zgartirish
// @access Private
exports.updateBook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const book = await models_1.Book.findByPk(id);
    if (!book) {
        throw new ApiError_1.ApiError(404, "Kitob topilmadi");
    }
    const { name, author_id, year, page, books, book_count, description } = req.body;
    let imageId = book.getDataValue("image_id");
    if (req.file) {
        // Eski rasmni bazadan topamiz
        const oldImage = imageId ? await imageFile_1.ImageFile.findByPk(imageId) : null;
        // Eski rasm faylini o‘chirish
        if (oldImage && fs_1.default.existsSync(oldImage.path)) {
            fs_1.default.unlinkSync(oldImage.path);
        }
        // Yangi rasmni yaratish
        const newImage = await imageFile_1.ImageFile.create({
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
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob muvaffaqiyatli yangilandi",
        data: book,
        statusCode: 200,
    });
});
// @router DELETE /api/books/:id
// @desc Kitobni o'chirish
// @access Private
exports.deleteBook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const book = await models_1.Book.findByPk(id);
    if (!book) {
        throw new ApiError_1.ApiError(404, "Kitob topilmadi");
    }
    await book.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob muvaffaqiyatli o'chirildi",
        data: book,
        statusCode: 200,
    });
});
