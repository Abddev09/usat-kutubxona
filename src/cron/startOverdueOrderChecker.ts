import cron from "node-cron";
import { Op } from "sequelize";
import dayjs from "dayjs";
import { UserOrder } from "../models/UserOrder";
import { OrderStatus } from "../constants/statusOrder";
import { User } from "../models";
import { sendTelegramMessage } from "../utils/sendTelegramMessage";
import { UserOrderInstance } from "../types/models";

// 🔁 Har kuni soat 00:00 da ishga tushadi
export const startOverdueOrderChecker = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("🔁 [CRON] Overdue tekshiruv boshlandi...");

    const twentySevenDaysAgo = dayjs().subtract(27, "day").endOf("day");

    const overdueOrders = (await UserOrder.findAll({
      where: {
        status_id: {
          [Op.in]: [
            OrderStatus.READING,
            OrderStatus.RETURN_DUE,
            OrderStatus.EXTENDED,
          ],
        },
        taking_at: {
          [Op.lte]: twentySevenDaysAgo.toDate(),
        },
      },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["full_name", "telegram_id"],
        },
      ],
    })) as UserOrderInstance[];

    for (const order of overdueOrders) {
      await order.update({ status_id: OrderStatus.OVERDUE });

      const fullName = order.User?.full_name || "foydalanuvchi";
      const telegramId = order.User?.telegram_id;

      if (telegramId) {
        await sendTelegramMessage(
          telegramId,
          `<b>${fullName}</b>, siz olgan kitob ${dayjs(order.taking_at).format(
            "DD-MM-YYYY"
          )} sanasidan beri 27 kun o'tdi. Siz hali qaytarmagansiz. Qora ro'yxatga tushdingiz.`
        );
      }
    }

    console.log(
      `✅ ${overdueOrders.length} ta order OVERDUE holatiga o'tkazildi.`
    );
  });
};
