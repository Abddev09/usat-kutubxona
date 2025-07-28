"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const isAuthenticated = async (req, res, next) => {
    console.log("🔐 AUTH MIDDLEWARE ISHLADI!");
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError_1.ApiError(401, "Token topilmadi");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = Number(decoded.id);
        if (isNaN(userId)) {
            throw new ApiError_1.ApiError(401, "Token noto‘g‘ri");
        }
        const user = (await User_1.User.findOne({
            where: { id: decoded.id },
        }));
        if (!user)
            throw new ApiError_1.ApiError(401, "Foydalanuvchi topilmadi");
        req.user = user;
        next();
    }
    catch (err) {
        if (err instanceof ApiError_1.ApiError)
            return next(err);
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new ApiError_1.ApiError(401, "Token muddati tugagan"));
        }
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new ApiError_1.ApiError(401, "Token noto‘g‘ri"));
        }
        return next(new ApiError_1.ApiError(500, "Noma'lum xatolik"));
    }
};
exports.isAuthenticated = isAuthenticated;
