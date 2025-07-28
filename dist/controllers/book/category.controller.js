"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooksByCategoryAndKafedra = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getAllCategories = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const models_1 = require("../../models");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
// @router GET /api/categories
// @desc Barcha kategoriyalar
// @access Public
exports.getAllCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categories = await models_1.Category.findAll({
        order: [["id", "ASC"]],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha kategoriyalar",
        data: categories,
        statusCode: 200,
    });
});
// @router GET /api/categories/:id
// @desc Kategoriyani topish
// @access Public
exports.getCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const category = await models_1.Category.findByPk(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Kategoriya topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya topildi",
        data: category,
        statusCode: 200,
    });
});
// @router POST /api/categories
// @desc Kategoriya qo'shish
// @access Public
exports.createCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name_uz, name_ru, code } = req.body;
    if (!name_uz || !name_ru) {
        throw new ApiError_1.ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }
    const existing = await models_1.Category.findOne({
        where: {
            name_uz,
            name_ru,
        },
    });
    if (existing) {
        throw new ApiError_1.ApiError(409, "Bu nomdagi kategoriya allaqachon mavjud");
    }
    if (code) {
        const existingCode = await models_1.Category.findOne({
            where: { code },
        });
        if (existingCode) {
            throw new ApiError_1.ApiError(409, "Bu koddagi kategoriya allaqachon mavjud");
        }
    }
    const category = await models_1.Category.create({ name_uz, name_ru, code });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya qo'shildi",
        data: category,
        statusCode: 201,
    });
});
// @router PUT /api/categories/:id
// @desc Kategoriyani o'zgartirish
// @access Private
exports.updateCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name_uz, name_ru } = req.body;
    if (!name_uz || !name_ru) {
        throw new ApiError_1.ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }
    const category = await models_1.Category.findByPk(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Kategoriya topilmadi");
    }
    const existing = await models_1.Category.findOne({
        where: { name_uz },
    });
    if (existing && existing.getDataValue("id") !== +id) {
        throw new ApiError_1.ApiError(409, "Bu nomdagi kategoriya allaqachon mavjud");
    }
    await category.update({ name_uz, name_ru });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya yangilandi",
        data: category,
        statusCode: 200,
    });
});
// @router DELETE /api/categories/:id
// @desc Kategoriyani o'chirish
// @access Private
exports.deleteCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const category = await models_1.Category.findByPk(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Kategoriya topilmadi");
    }
    await category.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya o'chirildi",
        data: null,
        statusCode: 200,
    });
});
// @router GET /api/telegram/category/:id
// @desc Kitoblarni kategoriya va kafedra bo'yicha olish
// @access Public
exports.getBooksByCategoryAndKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categoryId = parseInt(req.params.id, 10);
    const kafedraId = req.query.kafedraId
        ? parseInt(String(req.query.kafedraId), 10)
        : undefined;
    if (isNaN(categoryId)) {
        throw new ApiError_1.ApiError(400, "Kategoriya ID son bo‘lishi kerak");
    }
    const category = await models_1.Category.findByPk(categoryId);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Kategoriya topilmadi");
    }
    if (kafedraId) {
        const kafedra = await models_1.Kafedra.findByPk(kafedraId);
        if (!kafedra) {
            throw new ApiError_1.ApiError(404, "Kafedra topilmadi");
        }
    }
    const books = await models_1.Book.findAll({
        include: [
            {
                model: models_1.Category,
                as: "categories",
                where: { id: categoryId },
                attributes: ["id", "name_uz", "name_ru"],
                through: { attributes: [] },
            },
            {
                model: models_1.BookItem,
                include: [
                    {
                        model: models_1.Kafedra,
                        attributes: ["id", "name_uz", "name_ru"],
                    },
                ],
                required: kafedraId ? true : false,
                where: kafedraId ? { kafedra_id: kafedraId } : undefined,
            },
        ],
        order: [["id", "ASC"]],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Mos kitoblar ro‘yxati",
        data: books,
        statusCode: 200,
    });
});
