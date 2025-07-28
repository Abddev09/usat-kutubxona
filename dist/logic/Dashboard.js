"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardNumber = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const responseHandler_1 = require("../utils/responseHandler");
// @router logic/dashboard
// @desc Kitoblar soni, Userlar soni , Foydalanishga berilgan kitoblar soni,
// @Privete
exports.dashboardNumber = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { Book, User, UserOrder } = req.models;
    const [books, users, issued] = await Promise.all([
        Book.count(),
        User.count(),
        UserOrder.count({
            where: {
                status_id: 2, // faqat berilganlar (optional: depends on your status system)
            },
        }),
    ]);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Dashboard statistikasi muvaffaqiyatli qaytarildi",
        data: {
            books,
            users,
            issued,
        },
        statusCode: 200,
    });
});
