import dayjs from "dayjs";
import { OrderStatus } from "../constants/statusOrder";

export function getOrderStatusMessage(order: any): string {
  const now = dayjs();
  const finishedAt = dayjs(order.finished_at);
  const takingAt = order.taking_at ? dayjs(order.taking_at) : null;

  switch (order.status_id) {
    case OrderStatus.CREATED:
      return "Buyurtma berildi";
    case OrderStatus.READY_FOR_PICKUP:
      return "Kitobni olib ketishingiz mumkin";
    case OrderStatus.READING:
      if (takingAt && now.isBefore(finishedAt)) return "Kitob o'qilmoqda";
      if (takingAt && now.isAfter(finishedAt))
        return "Kitob topshirish vaqti keldi";
      return "Kitob olib ketilgan";
    case OrderStatus.EXTENDED:
      return "Kitob topshirilishini kutyapmiz";
    case OrderStatus.RETURN_DUE:
      return "Kitob topshirish vaqti keldi";
    case OrderStatus.REJECTED:
      return "Buyurtma bekor qilindi";
    case OrderStatus.OVERDUE:
      return "Buyurtma qora ro'yxatda";
    case OrderStatus.ARCHIVED:
      return "Buyurtma arxivga o'tkazildi";
    default:
      return "Holat aniqlanmadi";
  }
}
