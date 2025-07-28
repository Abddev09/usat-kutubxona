"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderCron = void 0;
const sequelize_1 = require("sequelize");
const statusOrder_1 = require("../constants/statusOrder");
const models_1 = require("../models");
const sendTelegramMessage_1 = require("../utils/sendTelegramMessage");
const dayjs_1 = __importDefault(require("dayjs"));
const node_cron_1 = __importDefault(require("node-cron"));
const reminderCron = () => {
    // Har kuni 08:00 da tekshiradi
    node_cron_1.default.schedule("0 8 * * *", async () => {
        console.log("📩 [Reminder] Kitobni topshirish eslatmasi ishladi");
        const reminderDate = (0, dayjs_1.default)().add(1, "day").startOf("day").toDate();
        const orders = (await models_1.UserOrder.findAll({
            where: {
                status_id: statusOrder_1.OrderStatus.READING,
                finished_at: {
                    [sequelize_1.Op.between]: [
                        (0, dayjs_1.default)(reminderDate).startOf("day").toDate(),
                        (0, dayjs_1.default)(reminderDate).endOf("day").toDate(),
                    ],
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
        for (const order of orders) {
            const user = order.User;
            if (user?.telegram_id) {
                const lang = user.language || "uz";
                const name = user.full_name || "Foydalanuvchi";
                const message = lang === "ru"
                    ? `📖 <b>${name}</b>, напоминаем: завтра истекает срок возврата книги. Пожалуйста, подготовьтесь к возврату.`
                    : `📖 <b>${name}</b>, ertaga kitobni topshirish muddati tugaydi. Iltimos, topshirishga tayyor bo‘ling.`;
                await (0, sendTelegramMessage_1.sendTelegramMessage)(user.telegram_id, message);
            }
        }
        console.log(`✅ ${orders.length} ta eslatma yuborildi.`);
    });
};
exports.reminderCron = reminderCron;
