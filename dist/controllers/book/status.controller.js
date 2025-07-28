"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStatus = exports.updateStatus = exports.createStatus = exports.getStatus = exports.getAllStatus = void 0;
const asyncHandler_1 = require("../../middlewares/asyncHandler");
const Status_1 = require("../../models/Status");
const responseHandler_1 = require("../../utils/responseHandler");
const ApiError_1 = require("../../utils/ApiError");
// @router GET /api/status
// @desc Barcha statuslar
// @access Public
exports.getAllStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const status = await Status_1.Status.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha statuslar",
        data: status,
        statusCode: 200,
    });
});
// @router GET /api/status/:id
// @desc Statusni topish
// @access Public
exports.getStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const status = await Status_1.Status.findByPk(id);
    if (!status) {
        throw new ApiError_1.ApiError(404, "Status topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Status topildi",
        data: status,
        statusCode: 200,
    });
});
// @router POST /api/status
// @desc Status qo'shish
// @access Private
exports.createStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const status = await Status_1.Status.create(req.body);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Status muvaffaqiyatli qo'shildi",
        data: status,
        statusCode: 200,
    });
});
// @router PUT /api/status/:id
// @desc Statusni o'zgartirish
// @access Private
exports.updateStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const status = await Status_1.Status.findByPk(id);
    if (!status) {
        throw new ApiError_1.ApiError(404, "Status topilmadi");
    }
    await status.update(req.body);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Status muvaffaqiyatli yangilandi",
        data: status,
        statusCode: 200,
    });
});
// @router DELETE /api/status/:id
// @desc Statusni o'chirish
// @access Private
exports.deleteStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const status = await Status_1.Status.findByPk(id);
    if (!status) {
        throw new ApiError_1.ApiError(404, "Status topilmadi");
    }
    await status.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Status muvaffaqiyatli o'chirildi",
        data: status,
        statusCode: 200,
    });
});
