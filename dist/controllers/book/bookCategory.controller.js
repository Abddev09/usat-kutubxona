"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBookCategory = exports.updateBookCategory = exports.createBookCategory = exports.getBookCategory = exports.getAllBookCategories = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
const models_1 = require("../../models");
// @router GET /api/bookCategories
// @desc Barcha kategoriyalar
// @access Public
exports.getAllBookCategories = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const categories = await models_1.BookCategory.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha kategoriyalar",
        data: categories,
        statusCode: 200,
    });
});
// @router GET /api/bookCategories/:id
// @desc Kategoriyani topish
// @access Public
exports.getBookCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const category = await models_1.BookCategory.findByPk(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Kategoriya topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya topildi",
        data: category,
        statusCode: 200,
    });
});
// @router POST /api/bookCategories
// @desc Kategoriyani yaratish
// @access Private
exports.createBookCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const bookCategody = await models_1.BookCategory.create(req.body);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya muvaffaqiyatli yaratildi",
        data: bookCategody,
        statusCode: 200,
    });
});
// @router PUT /api/bookCategories/:id
// @desc Kategoriyani o'zgartirish
// @access Private
exports.updateBookCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const category = await models_1.BookCategory.findByPk(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Kategoriya topilmadi");
    }
    await category.update({ name });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya muvaffaqiyatli yangilandi",
        data: category,
        statusCode: 200,
    });
});
// @router DELETE /api/bookCategories/:id
// @desc Kategoriyani o'chirish
// @access Private
exports.deleteBookCategory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const category = await models_1.BookCategory.findByPk(id);
    if (!category) {
        throw new ApiError_1.ApiError(404, "Kategoriya topilmadi");
    }
    await category.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kategoriya muvaffaqiyatli o'chirildi",
        data: category,
        statusCode: 200,
    });
});
