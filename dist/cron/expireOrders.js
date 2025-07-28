"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpireOrdersCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const dayjs_1 = __importDefault(require("dayjs"));
const UserOrder_1 = require("../models/UserOrder");
const statusOrder_1 = require("../constants/statusOrder");
const startExpireOrdersCron = () => {
    // Har 24 soatda yuradi: "0 * * * *"
    node_cron_1.default.schedule("0 0 * * *", async () => {
        console.log("🚀 [CRON] Har 24 soatda ishga tushdi...");
        const expiredOrders = await UserOrder_1.UserOrder.findAll({
            where: {
                status_id: statusOrder_1.OrderStatus.READY_FOR_PICKUP,
                created_at: {
                    [sequelize_1.Op.lte]: (0, dayjs_1.default)().subtract(1, "day").toDate(),
                },
            },
        });
        for (const order of expiredOrders) {
            await order.update({
                status_id: statusOrder_1.OrderStatus.CREATED,
                book_item_id: null,
                taking_at: null,
                finished_at: null,
            });
        }
        console.log(`✅ ${expiredOrders.length} ta order reset qilindi.`);
    });
};
exports.startExpireOrdersCron = startExpireOrdersCron;
