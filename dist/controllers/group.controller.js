"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroup = exports.deleteGroup = exports.createGroup = exports.getGroup = exports.getAllGroups = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const Group_1 = require("../models/Group");
const responseHandler_1 = require("../utils/responseHandler");
const ApiError_1 = require("../utils/ApiError");
// @router GET /api/groups
// @desc Barcha guruhlar
// @access Public
exports.getAllGroups = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const groups = await Group_1.Group.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha guruhlar",
        data: groups,
        statusCode: 200,
    });
});
// @router GET /api/groups/:id
// @desc Guruhni topish
// @access Public
exports.getGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const group = await Group_1.Group.findByPk(id);
    if (!group) {
        throw new ApiError_1.ApiError(404, "Guruh topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh topildi",
        data: group,
        statusCode: 200,
    });
});
// @router POST /api/groups
// @desc Guruh qo'shish
// @access Public
exports.createGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, can_login } = req.body;
    const exists = await Group_1.Group.findOne({ where: { name } });
    if (exists) {
        throw new ApiError_1.ApiError(409, "Bu guruh allaqachon mavjud");
    }
    const lowercaseName = name.toLowerCase();
    const group = await Group_1.Group.create({
        name: lowercaseName,
        can_login,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh muvaffaqiyatli qo'shildi",
        data: group,
        statusCode: 200,
    });
});
// @router DELETE /api/groups/:id
// @desc Guruhni o'chirish
// @access Public
exports.deleteGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const group = await Group_1.Group.findByPk(id);
    if (!group) {
        throw new ApiError_1.ApiError(404, "Guruh topilmadi");
    }
    await group.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh muvaffaqiyatli o'chirildi",
        data: group,
        statusCode: 200,
    });
});
// @router PUT /api/groups/:id
// @desc Guruhni o'zgartirish
// @access Public
exports.updateGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name, can_login } = req.body;
    const group = await Group_1.Group.findByPk(id);
    if (!group) {
        throw new ApiError_1.ApiError(404, "Guruh topilmadi");
    }
    await group.update({
        name,
        can_login,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Guruh muvaffaqiyatli o'zgartirildi",
        data: group,
        statusCode: 200,
    });
});
