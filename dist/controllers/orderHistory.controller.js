"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrderHistory = exports.getOrderHistory = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const models_1 = require("../models");
const OrderHistory_1 = require("../models/OrderHistory");
const responseHandler_1 = require("../utils/responseHandler");
// @router POST /api/order-history/:user_order_id
// @desc buyurma tarixini ko'rish
// @access Admin
exports.getOrderHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user_order_id } = req.params;
    const history = await OrderHistory_1.OrderHistory.findAll({
        where: { user_order_id },
        include: [
            {
                model: models_1.User,
                as: "AdminUser",
                attributes: ["id", "full_name"],
            },
        ],
        order: [["created_at", "DESC"]],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma tarixlari",
        data: history,
        statusCode: 200,
    });
});
// @router GET /api/order-history
// @desc Get all order histories
// @access Admin
exports.getAllOrderHistory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const history = await OrderHistory_1.OrderHistory.findAll({
        include: [
            {
                model: models_1.User,
                as: "AdminUser",
                attributes: ["id", "full_name"],
            },
        ],
        order: [["created_at", "DESC"]],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha buyurtma tarixlari",
        data: history,
        statusCode: 200,
    });
});
