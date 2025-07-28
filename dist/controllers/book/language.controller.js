"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLanguage = exports.updateLanguage = exports.createLanguage = exports.getLanguage = exports.getAllLanguages = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const models_1 = require("../../models");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
// @router GET /api/languages
// @desc Barcha til
// @access Public
exports.getAllLanguages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const languages = await models_1.Language.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha til",
        data: languages,
        statusCode: 200,
    });
});
// @router GET /api/languages/:id
// @desc Tilni topish
// @access Public
exports.getLanguage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const language = await models_1.Language.findByPk(id);
    if (!language) {
        throw new ApiError_1.ApiError(404, "Til topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Til topildi",
        data: language,
        statusCode: 200,
    });
});
// @router POST /api/languages
// @desc Til qo'shish
// @access Private
exports.createLanguage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const language = await models_1.Language.create(req.body);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Til muvaffaqiyatli qo'shildi",
        data: language,
        statusCode: 200,
    });
});
// @router PUT /api/languages/:id
// @desc Tilni o'zgartirish
// @access Private
exports.updateLanguage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const language = await models_1.Language.findByPk(id);
    if (!language) {
        throw new ApiError_1.ApiError(404, "Til topilmadi");
    }
    await language.update(req.body);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Til muvaffaqiyatli o'zgartirildi",
        data: language,
        statusCode: 200,
    });
});
// @router DELETE /api/languages/:id
// @desc Tilni o'chirish
// @access Private
exports.deleteLanguage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const language = await models_1.Language.findByPk(id);
    if (!language) {
        throw new ApiError_1.ApiError(404, "Til topilmadi");
    }
    await language.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Til muvaffaqiyatli o'chirildi",
        data: language,
        statusCode: 200,
    });
});
