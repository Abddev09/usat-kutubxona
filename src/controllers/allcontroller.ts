import { asyncHandler } from "../middlewares/asyncHandler";
import { Book, StudentGroup, User, UserOrder, Yonalish } from "../models";
import { UserInstance } from "../types/User";

export const getAllOrdersKafedra = asyncHandler(async (req, res) => {
  const lang = (req.query.lang === "ru" ? "ru" : "uz") as "uz" | "ru";
  const report = (await User.findAll({
    attributes: ["id", "full_name", "phone"],
    include: [
      {
        model: StudentGroup,
        attributes: ["id", "name"],
        include: [
          {
            model: Yonalish,
            attributes: ["id", "name_uz", "name_ru"],
            // ❌ Kafedra umuman yo'q
          },
        ],
      },
      {
        model: UserOrder,
        attributes: ["id", "status_id", "created_at"],
        include: [
          {
            model: Book,
            as: "Book",
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  })) as unknown as UserInstance[];

  const statusMap: Record<number, string> = {
    1: "Buyurtma berildi",
    2: "Olib ketilgan",
    3: "O'qilmoqda",
    4: "Topshirish vaqti keldi",
    5: "Topshirilishi kutilmoqda",
    6: "Bekor qilindi",
    7: "Qora ro'yxatda",
    8: "Arxiv",
  };

  const result = report.map((user) => ({
    full_name: user.full_name,
    phone: user.phone,
    // ❌ Kafedra umuman chiqarilmaydi
    yonalish: user.StudentGroup?.Yonalish
      ? (user.StudentGroup.Yonalish as any)[`name_${lang}`]
      : "Noma'lum",
    group: user.StudentGroup?.name || "Noma'lum",
    orders:
      user.UserOrders?.map((order) => ({
        name: order.Book?.name || "Noma'lum",
        status: statusMap[order.status_id] || "Noma'lum status",
        created_at: order.created_at,
      })) || [],
  }));

  return res.status(200).json({
    status: "success",
    data: result,
  });
});
