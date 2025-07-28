"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooksByCategoryAndKafedra = exports.getCategoryKafedralar = exports.deleteBookCategoryKafedra = exports.updateBookCategoryKafedra = exports.createBookCategoryKafedra = exports.getBookCategoryKafedra = exports.getAllBookCategoryKafedras = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const responseHandler_1 = require("../utils/responseHandler");
const models_1 = require("../models");
// @route GET /api/book-category-kafedra
// @desc Barchasini olish
// @access Public
exports.getAllBookCategoryKafedras = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const all = await models_1.BookCategoryKafedra.findAll({
        order: [["id", "ASC"]],
        include: [
            {
                model: models_1.Category,
                as: "category",
                attributes: ["id", "name_uz", "name_ru"],
            },
            {
                model: models_1.Book,
                as: "book",
                attributes: ["id", "name"],
            },
            {
                model: models_1.Kafedra,
                as: "kafedra",
                attributes: ["id", "name_uz", "name_ru"],
            },
        ],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha yozuvlar",
        data: all,
        statusCode: 200,
    });
});
// @route GET /api/book-category-kafedra/:id
// @desc Bitta yozuvni olish
// @access Public
exports.getBookCategoryKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const item = await models_1.BookCategoryKafedra.findByPk(id);
    if (!item)
        throw new ApiError_1.ApiError(404, "Yozuv topilmadi");
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuv topildi",
        data: item,
        statusCode: 200,
    });
});
// @route POST /api/book-category-kafedra
// @desc Yozuv qo‘shish
// @access Private
exports.createBookCategoryKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { category_id, kafedra_id } = req.body;
    if (!category_id || !kafedra_id) {
        throw new ApiError_1.ApiError(400, "category_id va kafedra_id majburiy");
    }
    const created = await models_1.BookCategoryKafedra.create({
        category_id: Number(category_id),
        kafedra_id: Number(kafedra_id),
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuv yaratildi",
        data: created,
        statusCode: 201,
    });
});
// @route PUT /api/book-category-kafedra/:id
// @desc Yozuvni yangilash
// @access Private
exports.updateBookCategoryKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { category_id, kafedra_id } = req.body;
    const item = await models_1.BookCategoryKafedra.findByPk(id);
    if (!item)
        throw new ApiError_1.ApiError(404, "Yozuv topilmadi");
    const updated = await item.update({
        category_id: category_id !== undefined
            ? Number(category_id)
            : item.getDataValue("category_id"),
        kafedra_id: kafedra_id !== undefined
            ? Number(kafedra_id)
            : item.getDataValue("kafedra_id"),
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuv yangilandi",
        data: updated,
        statusCode: 200,
    });
});
// @route DELETE /api/book-category-kafedra/:id
// @desc Yozuvni o‘chirish
// @access Private
exports.deleteBookCategoryKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const item = await models_1.BookCategoryKafedra.findByPk(id);
    if (!item)
        throw new ApiError_1.ApiError(404, "Yozuv topilmadi");
    await item.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuv muvaffaqiyatli o‘chirildi",
        data: null,
        statusCode: 200,
    });
});
/**
 * GET /api/categories/:id/kafedralar
 * Shu kategoriya bo‘yicha bog‘langan kafedralar
 */
exports.getCategoryKafedralar = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const kafedralar = await models_1.BookCategoryKafedra.findAll({
        where: { category_id: id },
        include: [
            {
                model: models_1.Kafedra,
                attributes: ["id", "name_uz", "name_ru"],
            },
        ],
    });
    const result = kafedralar.map((item) => ({
        kafedra_id: item.get("kafedra_id"),
        name_uz: item.Kafedra?.name_uz,
        name_ru: item.Kafedra?.name_ru,
    }));
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kafedralar ro'yxati",
        data: result,
    });
});
/**
 * GET /api/categories/:categoryId/kafedralar/:kafedraId/books
 * Shu kategoriya va kafedra bo‘yicha kitoblar
 */
exports.getBooksByCategoryAndKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { categoryId, kafedraId } = req.params;
    const books = await models_1.BookCategoryKafedra.findAll({
        where: {
            category_id: categoryId,
            kafedra_id: kafedraId,
        },
        include: [
            {
                model: models_1.Book,
                as: "book",
            },
        ],
    });
    const result = books.map((item) => {
        const book = item.book;
        return {
            book_id: item.get("book_id"),
            book: book ? book.toJSON() : null,
        };
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitoblar ro'yxati",
        data: result,
    });
});
