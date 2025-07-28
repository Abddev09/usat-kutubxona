"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersKafedra = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const models_1 = require("../models");
exports.getAllOrdersKafedra = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lang = (req.query.lang === "ru" ? "ru" : "uz");
    const report = (await models_1.User.findAll({
        attributes: ["id", "full_name", "phone"],
        include: [
            {
                model: models_1.StudentGroup,
                attributes: ["id", "name"],
                include: [
                    {
                        model: models_1.Yonalish,
                        attributes: ["id", "name_uz", "name_ru"],
                        // ❌ Kafedra umuman yo'q
                    },
                ],
            },
            {
                model: models_1.UserOrder,
                attributes: ["id", "status_id", "created_at"],
                include: [
                    {
                        model: models_1.Book,
                        as: "Book",
                        attributes: ["id", "name"],
                    },
                ],
            },
        ],
    }));
    const statusMap = {
        1: "Buyurtma berildi",
        2: "Olib ketilgan",
        3: "O'qilmoqda",
        4: "Topshirish vaqti keldi",
        5: "Topshirilishi kutilmoqda",
        6: "Bekor qilindi",
        7: "Qora ro'yxatda",
        8: "Arxiv",
    };
    const result = report.map((user) => ({
        full_name: user.full_name,
        phone: user.phone,
        // ❌ Kafedra umuman chiqarilmaydi
        yonalish: user.StudentGroup?.Yonalish
            ? user.StudentGroup.Yonalish[`name_${lang}`]
            : "Noma'lum",
        group: user.StudentGroup?.name || "Noma'lum",
        orders: user.UserOrders?.map((order) => ({
            name: order.Book?.name || "Noma'lum",
            status: statusMap[order.status_id] || "Noma'lum status",
            created_at: order.created_at,
        })) || [],
    }));
    return res.status(200).json({
        status: "success",
        data: result,
    });
});
