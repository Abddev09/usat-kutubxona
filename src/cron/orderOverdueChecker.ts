import cron from "node-cron";
import dayjs from "dayjs";
import { UserOrder } from "../models/UserOrder";
import { OrderStatus } from "../constants/statusOrder";
import { sendTelegramMessage } from "../utils/sendTelegramMessage";
import { User } from "../models";
import { Op } from "sequelize";
import { UserOrderInstance } from "../types/models";

// Har kuni 03:00 da ishga tushadi
cron.schedule("0 3 * * *", async () => {
  console.log("📚 Overdue tekshiruv boshlanmoqda...");

  const now = dayjs().toDate();

  const overdueOrders = (await UserOrder.findAll({
    where: {
      status_id: {
        [Op.in]: [OrderStatus.RETURN_DUE, OrderStatus.EXTENDED],
      },
      finished_at: {
        [Op.lt]: now,
      },
    },
    include: [
      {
        model: User,
        as: "User",
        attributes: ["telegram_id", "full_name", "language"],
      },
    ],
  })) as UserOrderInstance[];

  for (const order of overdueOrders) {
    const user = order.User;
    const fullName = user?.full_name || "Foydalanuvchi";

    await order.update({
      status_id: OrderStatus.OVERDUE,
    });

    if (user?.telegram_id) {
      const language = user.language || "uz";
      let message = "";
      if (language === "ru") {
        message = `⚠️ <b>${fullName}</b>, срок возврата книги истек.\nПожалуйста, верните книгу как можно скорее. В противном случае вы можете попасть в черный список.`;
      } else {
        message = `⚠️ <b>${fullName}</b>, kitobni topshirish muddati o'tdi.\nIltimos, tezroq topshiring. Aks holda siz qora ro'yxatga tushishingiz mumkin.`;
      }
      await sendTelegramMessage(user.telegram_id, message);
    }
  }

  console.log(
    `✅ Overdue tekshiruv yakunlandi. Topildi: ${overdueOrders.length}`
  );
});
