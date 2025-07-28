"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuther = exports.updateAuther = exports.deleteAuther = exports.getAuther = exports.getAllAuthers = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const models_1 = require("../../models");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
// @router GET /api/authers
// @desc Barcha Yozuvchilar
// @access Public
exports.getAllAuthers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const authers = await models_1.Auther.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha yozuvchilar",
        data: authers,
        statusCode: 200,
    });
});
// @router GET /api/authers/:id
// @desc Foydalanuvchini topish
// @access Public
exports.getAuther = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const auther = await models_1.Auther.findByPk(id);
    if (!auther) {
        throw new ApiError_1.ApiError(404, "Yozuvchi topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuvchi topildi",
        data: auther,
        statusCode: 200,
    });
});
// @router DELETE /api/authers/:id
// @desc Yozuvchi o'chirish
// @access Public
exports.deleteAuther = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const auther = await models_1.Auther.findByPk(id);
    if (!auther) {
        throw new ApiError_1.ApiError(404, "Yozuvchi topilmadi");
    }
    await auther.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuvchi muvaffaqiyatli o'chirildi",
        statusCode: 200,
    });
});
// @router PUT /api/authers/:id
// @desc Yozuvchini o'zgartirish
// @access Public
exports.updateAuther = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    const auther = await models_1.Auther.findByPk(id);
    if (!auther) {
        throw new ApiError_1.ApiError(404, "Yozuvchi topilmadi");
    }
    await auther.update({ name });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuvchi muvaffaqiyatli o'zgartirildi",
        data: auther,
        statusCode: 200,
    });
});
// @router POST /api/authers
// @desc Yozuvchi qo'shish
// @access Public
exports.createAuther = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name } = req.body;
    const exists = await models_1.Auther.findOne({ where: { name } });
    if (exists) {
        throw new ApiError_1.ApiError(409, "Bu yozuvchi allaqachon mavjud");
    }
    const auther = await models_1.Auther.create({ name });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yozuvchi qo'shildi",
        data: auther,
        statusCode: 200,
    });
});
