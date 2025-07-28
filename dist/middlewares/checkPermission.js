"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDynamicPermission = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const Permission_1 = require("../models/Permission");
const GroupPermission_1 = require("../models/GroupPermission");
const UserGroup_1 = require("../models/UserGroup");
const sequelize_1 = require("sequelize");
const checkDynamicPermission = () => {
    return async (req, res, next) => {
        try {
            const permissionCode = req.headers["x-permission"];
            if (!permissionCode)
                throw new ApiError_1.ApiError(400, "x-permission header topilmadi");
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                throw new ApiError_1.ApiError(401, "Token topilmadi");
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // User qanday group(larga) tegishli?
            const userGroups = (await UserGroup_1.UserGroup.findAll({
                where: { user_id: decoded.id },
            }));
            const groupIds = userGroups.map((ug) => ug.group_id);
            if (!groupIds.length)
                throw new ApiError_1.ApiError(403, "Foydalanuvchiga group biriktirilmagan");
            // Permission mavjudmi?
            const permission = (await Permission_1.Permission.findOne({
                where: { code_name: permissionCode },
            }));
            if (!permission)
                throw new ApiError_1.ApiError(404, `Permission topilmadi: ${permissionCode}`);
            // Ushbu permissionga ega group bormi?
            const hasPermission = await GroupPermission_1.GroupPermission.findOne({
                where: {
                    permission_id: permission.id,
                    group_id: { [sequelize_1.Op.in]: groupIds },
                },
            });
            if (!hasPermission)
                throw new ApiError_1.ApiError(403, `Ruxsat berilmagan: ${permissionCode}`);
            next();
        }
        catch (err) {
            console.error("❌ checkDynamicPermission error:", err);
            next(new ApiError_1.ApiError(500, "Ichki server xatoligi"));
        }
    };
};
exports.checkDynamicPermission = checkDynamicPermission;
