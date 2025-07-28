"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreUser = exports.getDeletedUsers = exports.getUser = exports.deleteUser = exports.updateUser = exports.registerUser = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const responseHandler_1 = require("../utils/responseHandler");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = require("../utils/ApiError");
const models_1 = require("../models");
// @router GET /api/users
// @desc Barcha foydalanuvchilar
// @access Public
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await User_1.User.findAll();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha foydalanuvchilar",
        data: users,
        statusCode: 200,
    });
});
// router POST /api/users/register
// @desc Registiratsiyadan o'tkazish
//@access Public
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { full_name, passport_id, phone, password, student_group_id, telegram_id, language, } = req.body;
    // 1. Unikal tekshiruvlar
    const [existingUser, existingTelegram, existingPhone] = await Promise.all([
        User_1.User.findOne({ where: { passport_id } }),
        telegram_id ? User_1.User.findOne({ where: { telegram_id } }) : null,
        User_1.User.findOne({ where: { phone } }),
    ]);
    if (existingUser)
        throw new ApiError_1.ApiError(409, "Passport ID mavjud");
    if (existingTelegram)
        throw new ApiError_1.ApiError(409, "Telegram ID allaqachon mavjud");
    if (existingPhone)
        throw new ApiError_1.ApiError(409, "Telefon raqam allaqachon mavjud");
    // 2. Parolni xeshlash
    const hashedPassword = await bcrypt_1.default.hash(password, Number(process.env.SALT_ROUNDS) || 10);
    // 3. Foydalanuvchini yaratish
    const newUser = await User_1.User.create({
        full_name: full_name.trim(),
        passport_id,
        phone,
        password: hashedPassword,
        student_group_id: student_group_id || null,
        telegram_id: telegram_id || null,
        language: language || null,
    });
    // 4. Agar telegram_id mavjud bo‘lsa — Group bilan bog‘lash
    if (telegram_id) {
        const studentGroup = await models_1.Group.findOne({
            where: { name: "Student" }, // lowercase
        });
        if (!studentGroup) {
            throw new ApiError_1.ApiError(500, `"Student" nomli group topilmadi. Iltimos, admin orqali yarating.`);
        }
        await models_1.UserGroup.create({
            user_id: newUser.get("id"),
            group_id: studentGroup.get("id"),
        });
    }
    // 5. Parolsiz user qaytariladi
    const { password: _, ...safeUser } = newUser.get({ plain: true });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi",
        data: safeUser,
        statusCode: 201,
    });
});
// @router UPDATE /api/users/:id
// @desc Foydalanuvchini o'zgartirish
// @access Private
exports.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { full_name, passport_id, phone, language } = req.body;
    // Userni borligini tekshirish
    const user = await User_1.User.findByPk(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    // model instance orqali update qilish — bu eng to‘g‘ri usul
    await user.update({
        full_name,
        passport_id,
        phone,
        language,
    });
    const { password, ...safeUser } = user.get({ plain: true });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi muvaffaqiyatli o'zgartirildi",
        data: safeUser,
        statusCode: 200,
    });
});
// @router DELETE /api/users/:id
// @desc Foydalanuvchini o'chirish
// @access Private
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = await User_1.User.findByPk(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    await user.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi soft-delete qilindi",
        statusCode: 200,
    });
});
// @router GET /api/users/:id
// @desc Foydalanuvchini ko'rish
// @access Private
exports.getUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const user = await User_1.User.findByPk(id);
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    const { password, ...safeUser } = user.get({ plain: true });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi topildi",
        data: safeUser,
        statusCode: 200,
    });
});
// @router  GET /api/users/deleted
// @desc O'chirilgan foydalanuvchilar
// @access Private
exports.getDeletedUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = (await User_1.User.findAll({
        where: {},
        paranoid: false, // o‘chirilganlarni ham olish uchun
    }));
    const deletedUsers = users.filter((user) => user.deletedAt !== null);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "O‘chirilgan foydalanuvchilar ro‘yxati",
        data: deletedUsers,
        statusCode: 200,
    });
});
// @router POST /api//users/:id/restore
// @desc O'chirilgan foydalanuvchini tiklash
// @access Private
exports.restoreUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    console.log("🔍 Tiklanayotgan ID:", id);
    const user = (await User_1.User.findByPk(id, {
        paranoid: false,
    }));
    if (!user) {
        console.log("❌ User topilmadi");
        return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    if (user.deletedAt === null) {
        console.log("⚠️ User o‘chirilmagan");
        return res.status(400).json({ message: "Bu foydalanuvchi o‘chirilmagan" });
    }
    await user.restore();
    console.log("✅ Tiklandi:", user.id);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchi tiklandi",
        data: user,
        statusCode: 200,
    });
});
