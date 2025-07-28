import cron from "node-cron";
import { Op } from "sequelize";
import dayjs from "dayjs";
import { UserOrder } from "../models/UserOrder";
import { OrderStatus } from "../constants/statusOrder";

export const startExpireOrdersCron = () => {
  // Har 24 soatda yuradi: "0 * * * *"
  cron.schedule("0 0 * * *", async () => {
    console.log("🚀 [CRON] Har 24 soatda ishga tushdi...");

    const expiredOrders = await UserOrder.findAll({
      where: {
        status_id: OrderStatus.READY_FOR_PICKUP,
        created_at: {
          [Op.lte]: dayjs().subtract(1, "day").toDate(),
        },
      },
    });

    for (const order of expiredOrders) {
      await order.update({
        status_id: OrderStatus.CREATED,
        book_item_id: null,
        taking_at: null,
        finished_at: null,
      });
    }

    console.log(`✅ ${expiredOrders.length} ta order reset qilindi.`);
  });
};
