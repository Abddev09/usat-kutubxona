import { Op } from "sequelize";
import { OrderStatus } from "../constants/statusOrder";
import { User, UserOrder } from "../models";
import { sendTelegramMessage } from "../utils/sendTelegramMessage";
import dayjs from "dayjs";
import cron from "node-cron";
import { UserOrderInstance } from "../types/models";

export const reminderCron = () => {
  // Har kuni 08:00 da tekshiradi
  cron.schedule("0 8 * * *", async () => {
    console.log("📩 [Reminder] Kitobni topshirish eslatmasi ishladi");

    const reminderDate = dayjs().add(1, "day").startOf("day").toDate();

    const orders = (await UserOrder.findAll({
      where: {
        status_id: OrderStatus.READING,
        finished_at: {
          [Op.between]: [
            dayjs(reminderDate).startOf("day").toDate(),
            dayjs(reminderDate).endOf("day").toDate(),
          ],
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

    for (const order of orders) {
      const user = order.User;
      if (user?.telegram_id) {
        const lang = user.language || "uz";
        const name = user.full_name || "Foydalanuvchi";

        const message =
          lang === "ru"
            ? `📖 <b>${name}</b>, напоминаем: завтра истекает срок возврата книги. Пожалуйста, подготовьтесь к возврату.`
            : `📖 <b>${name}</b>, ertaga kitobni topshirish muddati tugaydi. Iltimos, topshirishga tayyor bo‘ling.`;

        await sendTelegramMessage(user.telegram_id, message);
      }
    }

    console.log(`✅ ${orders.length} ta eslatma yuborildi.`);
  });
};
