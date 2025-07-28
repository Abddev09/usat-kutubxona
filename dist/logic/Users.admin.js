"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const models_1 = require("../models");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
const responseHandler_1 = require("../utils/responseHandler");
// @desc Barcha userlarni chiqarish (yo'nalish, kafedra va guruh bilan)
// @route GET /api/users
// @access Public
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const users = await models_1.User.findAll({
        include: [
            {
                model: models_1.StudentGroup,
                include: [
                    {
                        model: models_1.Yonalish,
                    },
                ],
            },
            {
                model: models_1.Group,
                as: "groups", // <-- alias qo‘shiladi
                through: { attributes: [] },
            },
        ],
    });
    if (!users)
        throw new ApiError_1.ApiError(404, "Foydalanuvchilar topilmadi");
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchilar ro'yxati",
        data: users,
        statusCode: 200,
    });
});
