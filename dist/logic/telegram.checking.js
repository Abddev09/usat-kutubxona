"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTelegramStep = exports.getTelegramUser = void 0;
const models_1 = require("../models");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const responseHandler_1 = require("../utils/responseHandler");
// @router GET /api/telegram/:id
// @desc Telegram userni topish
// @access Public
exports.getTelegramUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const telegramUser = await models_1.User.findOne({
        where: { telegram_id: id },
    });
    if (!telegramUser) {
        throw new ApiError_1.ApiError(404, "Telegram foydalanuvchisi topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Telegram foydalanuvchisi topildi",
        data: telegramUser,
        statusCode: 200,
    });
});
// @router Patch /api/step/:id
// @desc Telegram stepni o'zgartirish
// @access Public
exports.updateTelegramStep = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { step } = req.body;
    const telegramUser = await models_1.User.findByPk(id);
    if (!telegramUser) {
        throw new ApiError_1.ApiError(404, "Telegram user topilmadi");
    }
    await telegramUser.update({
        step,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Telegram step o'zgartirildi",
        data: telegramUser,
        statusCode: 200,
    });
});
