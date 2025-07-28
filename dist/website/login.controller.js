"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const responseHandler_1 = require("../utils/responseHandler");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
exports.siteLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { passport_id, password } = req.body;
    if (!passport_id || !password) {
        throw new ApiError_1.ApiError(400, "Passport ID va parol majburiy");
    }
    // Foydalanuvchini qidirish
    const user = await User_1.User.findOne({
        where: { passport_id },
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchi topilmadi");
    }
    // Parolni tekshirish
    const isMatch = await bcrypt_1.default.compare(password, user.getDataValue("password"));
    if (!isMatch) {
        throw new ApiError_1.ApiError(401, "Parol noto'g'ri");
    }
    // Token yaratish
    const token = jsonwebtoken_1.default.sign({
        id: user.getDataValue("id"),
        passport_id,
        role: "student", // Default sifatida student
    }, JWT_SECRET, { expiresIn: "7d" });
    // Javob yuborish
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Tizimga muvaffaqiyatli kirildi",
        data: {
            user: {
                id: user.getDataValue("id"),
                full_name: user.getDataValue("full_name"),
                phone: user.getDataValue("phone"),
                passport_id: user.getDataValue("passport_id"),
            },
            token,
        },
        statusCode: 200,
    });
});
