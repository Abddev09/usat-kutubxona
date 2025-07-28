"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserGroups = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const models_1 = require("../models");
const ApiError_1 = require("../utils/ApiError");
const responseHandler_1 = require("../utils/responseHandler");
// @router  GET /api/user-groups
// @desc Barcha foydalanuvchilar
// @access Public
exports.getAllUserGroups = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userGroups = await models_1.UserGroup.findAll({
        include: [{ model: models_1.User }, { model: models_1.Group }],
    });
    if (!userGroups || userGroups.length === 0) {
        throw new ApiError_1.ApiError(404, "Foydalanuvchilar topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha foydalanuvchilar",
        data: userGroups,
        statusCode: 200,
    });
});
