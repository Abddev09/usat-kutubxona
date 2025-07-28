"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const dayjs_1 = __importDefault(require("dayjs"));
const UserOrder_1 = require("../models/UserOrder");
const statusOrder_1 = require("../constants/statusOrder");
const sendTelegramMessage_1 = require("../utils/sendTelegramMessage");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
// Har kuni 03:00 da ishga tushadi
node_cron_1.default.schedule("0 3 * * *", async () => {
    console.log("📚 Overdue tekshiruv boshlanmoqda...");
    const now = (0, dayjs_1.default)().toDate();
    const overdueOrders = (await UserOrder_1.UserOrder.findAll({
        where: {
            status_id: {
                [sequelize_1.Op.in]: [statusOrder_1.OrderStatus.RETURN_DUE, statusOrder_1.OrderStatus.EXTENDED],
            },
            finished_at: {
                [sequelize_1.Op.lt]: now,
            },
        },
        include: [
            {
                model: models_1.User,
                as: "User",
                attributes: ["telegram_id", "full_name", "language"],
            },
        ],
    }));
    for (const order of overdueOrders) {
        const user = order.User;
        const fullName = user?.full_name || "Foydalanuvchi";
        await order.update({
            status_id: statusOrder_1.OrderStatus.OVERDUE,
        });
        if (user?.telegram_id) {
            const language = user.language || "uz";
            let message = "";
            if (language === "ru") {
                message = `⚠️ <b>${fullName}</b>, срок возврата книги истек.\nПожалуйста, верните книгу как можно скорее. В противном случае вы можете попасть в черный список.`;
            }
            else {
                message = `⚠️ <b>${fullName}</b>, kitobni topshirish muddati o'tdi.\nIltimos, tezroq topshiring. Aks holda siz qora ro'yxatga tushishingiz mumkin.`;
            }
            await (0, sendTelegramMessage_1.sendTelegramMessage)(user.telegram_id, message);
        }
    }
    console.log(`✅ Overdue tekshiruv yakunlandi. Topildi: ${overdueOrders.length}`);
});
