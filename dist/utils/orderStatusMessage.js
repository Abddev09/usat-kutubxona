"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatusMessage = getOrderStatusMessage;
const dayjs_1 = __importDefault(require("dayjs"));
const statusOrder_1 = require("../constants/statusOrder");
function getOrderStatusMessage(order) {
    const now = (0, dayjs_1.default)();
    const finishedAt = (0, dayjs_1.default)(order.finished_at);
    const takingAt = order.taking_at ? (0, dayjs_1.default)(order.taking_at) : null;
    switch (order.status_id) {
        case statusOrder_1.OrderStatus.CREATED:
            return "Buyurtma berildi";
        case statusOrder_1.OrderStatus.READY_FOR_PICKUP:
            return "Kitobni olib ketishingiz mumkin";
        case statusOrder_1.OrderStatus.READING:
            if (takingAt && now.isBefore(finishedAt))
                return "Kitob o'qilmoqda";
            if (takingAt && now.isAfter(finishedAt))
                return "Kitob topshirish vaqti keldi";
            return "Kitob olib ketilgan";
        case statusOrder_1.OrderStatus.EXTENDED:
            return "Kitob topshirilishini kutyapmiz";
        case statusOrder_1.OrderStatus.RETURN_DUE:
            return "Kitob topshirish vaqti keldi";
        case statusOrder_1.OrderStatus.REJECTED:
            return "Buyurtma bekor qilindi";
        case statusOrder_1.OrderStatus.OVERDUE:
            return "Buyurtma qora ro'yxatda";
        case statusOrder_1.OrderStatus.ARCHIVED:
            return "Buyurtma arxivga o'tkazildi";
        default:
            return "Holat aniqlanmadi";
    }
}
