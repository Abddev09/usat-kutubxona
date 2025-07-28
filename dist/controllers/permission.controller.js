"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermission = exports.updatePermission = exports.deletePermission = exports.getPermission = exports.getAllPermissions = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const Permission_1 = require("../models/Permission");
const responseHandler_1 = require("../utils/responseHandler");
const ApiError_1 = require("../utils/ApiError");
// @router GET /api/permissions
// @desc Barcha foydalanuvchilar
// @access Public
exports.getAllPermissions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const permissions = await Permission_1.Permission.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha Ruxsatlar",
        data: permissions,
        statusCode: 200,
    });
});
// @router GET /api/permissions/:id
// @desc Foydalanuvchini topish
// @access Public
exports.getPermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const permission = await Permission_1.Permission.findByPk(id);
    if (!permission) {
        throw new ApiError_1.ApiError(404, "Ruxsat topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Ruxsat topildi",
        data: permission,
        statusCode: 200,
    });
});
// @router DELETE /api/permissions/:id
// @desc Foydalanuvchini o'chirish
// @access Public
exports.deletePermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const permission = await Permission_1.Permission.findByPk(id);
    if (!permission) {
        throw new ApiError_1.ApiError(404, "Ruxsat topilmadi");
    }
    await permission.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Ruxsat muvaffaqiyatli o‘chirildi",
        data: permission,
        statusCode: 200,
    });
});
// @router PUT /api/permissions/:id
// @desc Foydalanuvchini o'zgartirish
// @access Public
exports.updatePermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { code_name, name, table } = req.body;
    const permission = await Permission_1.Permission.findByPk(id);
    if (!permission) {
        throw new ApiError_1.ApiError(404, "Ruxsat topilmadi");
    }
    await permission.update({
        code_name,
        name,
        table,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Ruxsat muvaffaqiyatli o‘zgartirildi",
        data: permission,
        statusCode: 200,
    });
});
// @router POST /api/permissions
// @desc Foydalanuvchini yaratish
// @access Public
exports.createPermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { code_name, name, table } = req.body;
    const permission = await Permission_1.Permission.create({
        code_name,
        name,
        table,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Ruxsat muvaffaqiyatli yaratildi",
        data: permission,
        statusCode: 200,
    });
});
