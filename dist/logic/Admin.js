"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getUser = exports.getAllUsers = exports.RegisterPage = exports.LoginPage = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const models_1 = require("../models/");
const ApiError_1 = require("../utils/ApiError");
const responseHandler_1 = require("../utils/responseHandler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// @router POST /api/login
// @desc Foydalanuvchini login qilish
// @access Public
exports.LoginPage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { passport_id, password } = req.body;
    // 1. Foydalanuvchini topamiz
    const user = (await models_1.User.findOne({
        where: { passport_id },
    }));
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    // 2. Parolni tekshiramiz
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError_1.ApiError(401, "Parol noto‘g‘ri");
    }
    // 3. Foydalanuvchining guruhlarini olish
    const userGroups = (await models_1.UserGroup.findAll({
        where: { user_id: user.id },
        include: [{ model: models_1.Group, as: "groupInfo" }],
    }));
    // 4. Login huquqi bor guruhlarni ajratib olish
    const allowedGroups = userGroups.filter((ug) => ug.groupInfo?.can_login);
    if (allowedGroups.length === 0) {
        throw new ApiError_1.ApiError(403, "Siz tizimga kira olmaysiz. Ruxsat yo‘q.");
    }
    // 5. JWT token tayyorlash
    const groupIds = allowedGroups.map((ug) => ug.group_id);
    const firstAllowedGroup = allowedGroups[0].groupInfo.name.toLowerCase(); // optional, faqat birinchi group role sifatida
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        groupIds,
        role: firstAllowedGroup,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });
    // 6. Parolni yubormaslik
    const { password: _, ...safeUser } = user.get({ plain: true });
    const safeUserGroups = userGroups.map((ug) => {
        const { groupInfo: _, ...safeUg } = ug.get({ plain: true });
        return safeUg;
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Muvaffaqiyatli login qilindi",
        data: {
            ...safeUser,
            userGroups,
            token,
        },
        statusCode: 200,
    });
});
// @router POST /api/register
// @desc Foydalanuvchini ro'yxatdan o'tkazish
// @access Public
exports.RegisterPage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { full_name, passport_id, phone, password, group_id } = req.body;
    const existingUser = await models_1.User.findOne({ where: { passport_id } });
    if (existingUser) {
        throw new ApiError_1.ApiError(409, "Ushbu passport ID bilan foydalanuvchi allaqachon mavjud");
    }
    const group = await models_1.Group.findByPk(group_id);
    if (!group) {
        throw new ApiError_1.ApiError(404, "Tanlangan rol mavjud emas");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = (await models_1.User.create({
        full_name,
        passport_id,
        phone,
        password: hashedPassword,
    }));
    await models_1.UserGroup.create({
        user_id: newUser.id,
        group_id: group?.get("id") || group_id,
    });
    const { password: _, ...safeUser } = newUser.get({ plain: true });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi",
        data: safeUser,
        statusCode: 201,
    });
});
// @router GET /api/users
// @desc Foydalanuvchilarni ko'rish
// @access Private
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await models_1.UserGroup.findAll({
        include: [
            {
                model: models_1.User,
                attributes: ["id", "full_name", "passport_id", "phone"],
                as: "user",
            },
            {
                model: models_1.Group,
                attributes: ["id", "name"],
                as: "groupInfo",
            },
        ],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchilar topildi",
        data: users,
        statusCode: 200,
    });
});
// @router Get /api/users/:id
// @desc Foydalanuvchini ko'rish
// @access Private
exports.getUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = await models_1.UserGroup.findByPk(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi topildi",
        data: user,
        statusCode: 200,
    });
});
// @router DELETE /api/users/:id
// @desc Foydalanuvchini o'chirish
// @access Private
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = await models_1.UserGroup.findByPk(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    await user.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
        statusCode: 200,
    });
});
// @router PATCH /api/users/:id
// @desc Foydalanuvchini o'zgartirish
// @access Private
exports.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { full_name, passport_id, phone, group_id } = req.body;
    const user = (await models_1.User.findByPk(id));
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    // 1. USER'ni yangilaymiz
    await user.update({
        full_name,
        passport_id,
        phone,
    });
    // 2. GROUP borligini tekshiramiz (optional)
    if (group_id) {
        const group = await models_1.Group.findByPk(group_id);
        if (!group) {
            throw new ApiError_1.ApiError(404, "Tanlangan rol mavjud emas");
        }
        // 3. UserGroupni topib, yangilaymiz
        const userGroup = (await models_1.UserGroup.findOne({
            where: { user_id: user.id },
        }));
        if (userGroup) {
            await userGroup.update({ group_id });
        }
        else {
            // User oldin yoq bo'lgan bo‘lsa, qo‘shib qo‘yamiz
            await models_1.UserGroup.create({
                user_id: user.id,
                group_id,
            });
        }
    }
    const { password: _, ...safeUser } = user.get({ plain: true });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi muvaffaqiyatli o‘zgartirildi",
        data: safeUser,
        statusCode: 200,
    });
});
