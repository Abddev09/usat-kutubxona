"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOverdueOrderChecker = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const dayjs_1 = __importDefault(require("dayjs"));
const UserOrder_1 = require("../models/UserOrder");
const statusOrder_1 = require("../constants/statusOrder");
const models_1 = require("../models");
const sendTelegramMessage_1 = require("../utils/sendTelegramMessage");
// 🔁 Har kuni soat 00:00 da ishga tushadi
const startOverdueOrderChecker = () => {
    node_cron_1.default.schedule("0 0 * * *", async () => {
        console.log("🔁 [CRON] Overdue tekshiruv boshlandi...");
        const twentySevenDaysAgo = (0, dayjs_1.default)().subtract(27, "day").endOf("day");
        const overdueOrders = (await UserOrder_1.UserOrder.findAll({
            where: {
                status_id: {
                    [sequelize_1.Op.in]: [
                        statusOrder_1.OrderStatus.READING,
                        statusOrder_1.OrderStatus.RETURN_DUE,
                        statusOrder_1.OrderStatus.EXTENDED,
                    ],
                },
                taking_at: {
                    [sequelize_1.Op.lte]: twentySevenDaysAgo.toDate(),
                },
            },
            include: [
                {
                    model: models_1.User,
                    as: "User",
                    attributes: ["full_name", "telegram_id"],
                },
            ],
        }));
        for (const order of overdueOrders) {
            await order.update({ status_id: statusOrder_1.OrderStatus.OVERDUE });
            const fullName = order.User?.full_name || "foydalanuvchi";
            const telegramId = order.User?.telegram_id;
            if (telegramId) {
                await (0, sendTelegramMessage_1.sendTelegramMessage)(telegramId, `<b>${fullName}</b>, siz olgan kitob ${(0, dayjs_1.default)(order.taking_at).format("DD-MM-YYYY")} sanasidan beri 27 kun o'tdi. Siz hali qaytarmagansiz. Qora ro'yxatga tushdingiz.`);
            }
        }
        console.log(`✅ ${overdueOrders.length} ta order OVERDUE holatiga o'tkazildi.`);
    });
};
exports.startOverdueOrderChecker = startOverdueOrderChecker;
