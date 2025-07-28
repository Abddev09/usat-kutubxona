"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKafedra = exports.updateKafedra = exports.deleteKafedra = exports.getKafedra = exports.getAllKafedras = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const models_1 = require("../models");
const responseHandler_1 = require("../utils/responseHandler");
const ApiError_1 = require("../utils/ApiError");
// @router GET /api/kafedra
// @desc Barcha kafedralar
// @access Private
exports.getAllKafedras = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const kafedralar = await models_1.Kafedra.findAll({
        order: [["id", "ASC"]],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha kafedralar",
        data: kafedralar,
        statusCode: 200,
    });
});
// @router GET /api/kafedra/:id
// @desc Kafedrani topish
// @access Private
exports.getKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const kafedra = await models_1.Kafedra.findByPk(id);
    if (!kafedra) {
        throw new ApiError_1.ApiError(404, "Kafedra topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kafedra topildi",
        data: kafedra,
        statusCode: 200,
    });
});
// @router DELETE /api/kafedra/:id
// @desc Kafedrani o'chirish
// @access Private
exports.deleteKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const kafedra = await models_1.Kafedra.findByPk(id);
    if (!kafedra) {
        throw new ApiError_1.ApiError(404, "Kafedra topilmadi");
    }
    await kafedra.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kafedra muvaffaqiyatli o‘chirildi",
        data: null,
        statusCode: 200,
    });
});
// @router PUT /api/kafedra/:id
// @desc Kafedrani o'zgartirish
// @access Private
exports.updateKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name_uz, name_ru } = req.body;
    if (!name_uz || !name_ru) {
        throw new ApiError_1.ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }
    const kafedra = await models_1.Kafedra.findByPk(id);
    if (!kafedra) {
        throw new ApiError_1.ApiError(404, "Kafedra topilmadi");
    }
    const existing = await models_1.Kafedra.findOne({
        where: { name_uz },
    });
    if (existing && existing.getDataValue("id") !== +id) {
        throw new ApiError_1.ApiError(409, "Bu nomdagi kafedra allaqachon mavjud");
    }
    await kafedra.update({ name_uz, name_ru });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kafedra muvaffaqiyatli yangilandi",
        data: kafedra,
        statusCode: 200,
    });
});
// @router POST /api/kafedra
// @desc Kafedra qo'shish
// @access Private
exports.createKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name_uz, name_ru } = req.body;
    if (!name_uz || !name_ru) {
        throw new ApiError_1.ApiError(400, "Ikkala nom ham to‘ldirilishi shart");
    }
    const existing = await models_1.Kafedra.findOne({
        where: { name_uz },
    });
    if (existing) {
        throw new ApiError_1.ApiError(409, "Bu nomdagi kafedra allaqachon mavjud");
    }
    const kafedra = await models_1.Kafedra.create({ name_uz, name_ru });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kafedra muvaffaqiyatli qo‘shildi",
        data: kafedra,
        statusCode: 201,
    });
});
