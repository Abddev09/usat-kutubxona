"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlphabet = exports.updateAlphabet = exports.createAlphabet = exports.getAlphabet = exports.getAllAlphabets = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const models_1 = require("../../models");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
// @router GET /api/alphabet
// @desc Barcha Alphabets
// @access Public
exports.getAllAlphabets = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const alphabets = await models_1.Alphabet.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha alifbo yozuvlari",
        data: alphabets,
        statusCode: 200,
    });
});
// @router GET /api/alphabet/:id
// @desc Alphabetni topish
// @access Public
exports.getAlphabet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const alphabet = await models_1.Alphabet.findByPk(id);
    if (!alphabet) {
        throw new ApiError_1.ApiError(404, "Alphabet topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Alphabet topildi",
        data: alphabet,
        statusCode: 200,
    });
});
// @router POST /api/alphabet
// @desc Alphabet qo'shish
// @access Public
exports.createAlphabet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name } = req.body;
    const exists = await models_1.Alphabet.findOne({ where: { name } });
    if (exists) {
        throw new ApiError_1.ApiError(409, "Bu alphabet allaqachon mavjud");
    }
    const alphabet = await models_1.Alphabet.create({ name });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Alphabet qo'shildi",
        data: alphabet,
        statusCode: 200,
    });
});
// @router PUT /api/alphabet/:id
// @desc Alphabetni o'zgartirish
// @access Public
exports.updateAlphabet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const alphabet = await models_1.Alphabet.findByPk(id);
    if (!alphabet) {
        throw new ApiError_1.ApiError(404, "Alphabet topilmadi");
    }
    await alphabet.update({ name });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Alphabet muvaffaqiyatli yangilandi",
        data: alphabet,
        statusCode: 200,
    });
});
// @router DELETE /api/alphabet/:id
// @desc Alphabetni o'chirish
// @access Public
exports.deleteAlphabet = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const alphabet = await models_1.Alphabet.findByPk(id);
    if (!alphabet) {
        throw new ApiError_1.ApiError(404, "Alphabet topilmadi");
    }
    await alphabet.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Alphabet muvaffaqiyatli o'chirildi",
        data: alphabet,
        statusCode: 200,
    });
});
