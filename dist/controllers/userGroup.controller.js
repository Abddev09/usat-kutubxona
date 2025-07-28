"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserGroup = exports.createUserGroup = exports.deleteUserGroup = exports.getUserGroup = exports.getAllUserGroups = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const Group_1 = require("../models/Group");
const User_1 = require("../models/User");
const UserGroup_1 = require("../models/UserGroup");
const responseHandler_1 = require("../utils/responseHandler");
const ApiError_1 = require("../utils/ApiError");
// @router GET /api/user-groups
// @desc Barcha foydalanuvchilar
// @access Public
exports.getAllUserGroups = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userGroups = await UserGroup_1.UserGroup.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha foydalanuvchilar",
        data: userGroups,
        statusCode: 200,
    });
});
// @router GET /api/user-groups/:id
// @desc Foydalanuvchini topish
// @access Public
exports.getUserGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const userGroup = await UserGroup_1.UserGroup.findByPk(id);
    if (!userGroup) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi topildi",
        data: userGroup,
        statusCode: 200,
    });
});
// @router DELETE /api/user-groups/:id
// @desc Foydalanuvchini o'chirish
// @access Public
exports.deleteUserGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const userGroup = await UserGroup_1.UserGroup.findByPk(id);
    if (!userGroup) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    await userGroup.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
        data: userGroup,
        statusCode: 200,
    });
});
// @router POST /api/user-groups
// @desc Foydalanuvchini qo'shish
// @access Public
exports.createUserGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user_id, group_id } = req.body;
    // 1. Duplikat bor-yo'qligini tekshirish
    const exists = await UserGroup_1.UserGroup.findOne({ where: { user_id, group_id } });
    if (exists) {
        throw new ApiError_1.ApiError(409, "Bu foydalanuvchi ushbu guruhga allaqachon biriktirilgan");
    }
    // 2. User va Group parallel tekshirish (tezroq ishlaydi)
    const [user, group] = await Promise.all([
        User_1.User.findByPk(user_id),
        Group_1.Group.findByPk(group_id),
    ]);
    if (!user)
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    if (!group)
        throw new ApiError_1.ApiError(404, "Guruh topilmadi");
    // 3. Biriktirish
    const userGroup = await UserGroup_1.UserGroup.create({ user_id, group_id });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi guruhga muvaffaqiyatli qo'shildi",
        data: userGroup,
        statusCode: 201,
    });
});
// @router PUT /api/user-groups/:id
// @desc Foydalanuvchini o'zgartirish
// @access Public
exports.updateUserGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { user_id, group_id } = req.body;
    const userGroup = await UserGroup_1.UserGroup.findByPk(id);
    if (!userGroup) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    await userGroup.update({
        user_id,
        group_id,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi muvaffaqiyatli o'zgartirildi",
        data: userGroup,
        statusCode: 200,
    });
});
