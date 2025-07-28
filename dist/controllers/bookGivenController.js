"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveGivenBooks = void 0;
const BookGiven_1 = require("../models/BookGiven");
const models_1 = require("../models");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const responseHandler_1 = require("../utils/responseHandler");
// OrderStatus enum orqali olib kelamiz
const ACTIVE_STATUSES = [3, 4, 5, 7]; // READING, RETURN_DUE, EXTENDED, OVERDUE
// @router GET /api/book-given/active
// @desc Kitob bergan adminlar va u hali qaytarilmaganlar ro'yxati
// @access Admin
exports.getActiveGivenBooks = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const results = await BookGiven_1.BookGiven.findAll({
        include: [
            {
                model: models_1.UserOrder,
                where: { status_id: ACTIVE_STATUSES },
                include: [
                    {
                        model: models_1.User,
                        as: "User", // AS: "User" EXACT bo'lishi KERAK!
                        attributes: ["id", "full_name", "phone"],
                    },
                    {
                        model: models_1.Book,
                        as: "Book",
                        attributes: ["id", "name"],
                    },
                ],
            },
            {
                model: models_1.User,
                as: "admin",
                attributes: ["id", "full_name"],
            },
        ],
    });
    return (0, responseHandler_1.sendSuccess)(res, { data: results });
});
