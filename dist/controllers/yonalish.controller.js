"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteYonalish = exports.updateYonalish = exports.createYonalish = exports.getYonalish = exports.getAllYonalish = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const models_1 = require("../models");
const responseHandler_1 = require("../utils/responseHandler");
const ApiError_1 = require("../utils/ApiError");
// @router GET /api/yonalish
// @desc Barcha yo‘nalishlar (kafedrasi bilan)
// @access Public
exports.getAllYonalish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const yonalishlar = await models_1.Yonalish.findAll({
        order: [["id", "ASC"]],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha yo‘nalishlar kafedrasi bilan",
        data: yonalishlar,
        statusCode: 200,
    });
});
// @router GET /api/yonalish/:id
// @desc Yonalishni topish
// @access Public
exports.getYonalish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const yonalish = await models_1.Yonalish.findByPk(id, {
        include: [
            {
                model: models_1.Kafedra,
                attributes: ["id", "name_uz", "name_ru"],
            },
        ],
    });
    if (!yonalish) {
        throw new ApiError_1.ApiError(404, "Yonalish topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yonalish topildi",
        data: yonalish,
        statusCode: 200,
    });
});
// @router POST /api/yonalish
// @desc Yonalish qo'shish
// @access Private
exports.createYonalish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name_ru, name_uz } = req.body;
    // Takroriy yo‘nalish tekshirish
    const existing = await models_1.Yonalish.findOne({ where: { name_uz, name_ru } });
    if (existing) {
        throw new ApiError_1.ApiError(409, "Bu yo‘nalish allaqachon mavjud");
    }
    const yonalish = await models_1.Yonalish.create({ name_ru, name_uz });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yonalish muvaffaqiyatli qo'shildi",
        data: yonalish,
        statusCode: 201,
    });
});
// @router PUT /api/yonalish/:id
// @desc Yonalishni o'zgartirish
// @access Private
exports.updateYonalish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name_uz, name_ru, kafedra_id } = req.body;
    const yonalish = await models_1.Yonalish.findByPk(id);
    if (!yonalish) {
        throw new ApiError_1.ApiError(404, "Yonalish topilmadi");
    }
    // Agar kafedra_id yuborilgan bo‘lsa, kafedrani ham tekshir
    if (kafedra_id) {
        const kafedra = await models_1.Kafedra.findByPk(kafedra_id);
        if (!kafedra) {
            throw new ApiError_1.ApiError(404, "Kafedra topilmadi");
        }
    }
    await yonalish.update({ name_uz, name_ru, kafedra_id });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yonalish muvaffaqiyatli yangilandi",
        data: yonalish,
        statusCode: 200,
    });
});
// @router DELETE /api/yonalish/:id
// @desc Yonalishni o'chirish
// @access Private
exports.deleteYonalish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const yonalish = await models_1.Yonalish.findByPk(id);
    if (!yonalish) {
        throw new ApiError_1.ApiError(404, "Yonalish topilmadi");
    }
    await yonalish.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Yonalish muvaffaqiyatli o‘chirildi",
        data: yonalish,
        statusCode: 200,
    });
});
