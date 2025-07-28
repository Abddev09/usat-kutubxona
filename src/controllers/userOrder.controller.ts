import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { UserOrder } from "../models/UserOrder";
import { sendSuccess } from "../utils/responseHandler";
import dayjs from "dayjs";
import { getOrderStatusMessage } from "../utils/orderStatusMessage";
import { OrderStatus } from "../constants/statusOrder";
import { Book, User } from "../models";
import { BookItemInstance, UserOrderInstance } from "../types/models";
import { sendTelegramMessage } from "../utils/sendTelegramMessage";
import { Op } from "sequelize";
import { OrderHistory } from "../models/OrderHistory";
import { BookGiven } from "../models/BookGiven";

// @router POST /api/v1/user-order
// @desc Buyurtma yaratish
// @access Public
export const createUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { user_id, book_id } = req.body;

    const userOrderFindUser = await User.findByPk(user_id);
    if (!userOrderFindUser) throw new Error("Foydalanuvchi topilmadi");

    const userOrderFindBook = await Book.findByPk(book_id);
    if (!userOrderFindBook) throw new Error("Kitob topilmadi");

    const existingOrder = await UserOrder.findOne({
      where: {
        user_id,
        book_id,
        status_id: {
          [Op.in]: [
            OrderStatus.CREATED,
            OrderStatus.READY_FOR_PICKUP,
            OrderStatus.READING,
            OrderStatus.EXTENDED,
          ],
        },
      },
    });
    if (existingOrder) throw new Error("Buyurtma allaqachon mavjud");

    const now = dayjs();
    const userOrder = await UserOrder.create({
      user_id,
      book_id,
      status_id: OrderStatus.CREATED,
      book_code: null,
      created_at: now.toDate(),
      taking_at: null,
      finished_at: null,
    });

    return sendSuccess(res, {
      message: "Buyurtma yaratildi",
      data: userOrder,
      statusCode: 200,
    });
  }
);

// @router GET /api/v1/user-order
// @desc Barcha buyurtmalarni olish
// @access Public
export const getAllUserOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.query;

    const whereClause: any = {};

    // Faqat status bo‘yicha filter kelsa qo‘shamiz
    if (status) {
      whereClause.status_id = +status; // query string bo‘lgani uchun raqamga aylantiramiz
    }

    const orders = await UserOrder.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "full_name", "phone", "telegram_id"],
        },
        {
          model: Book,
          as: "Book",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const now = dayjs();

    const ordersWithStatus = orders.map((order) => {
      const json = order.toJSON();

      // Dinamik RETURN_DUE qilish (agar filterlanganda ham kerak bo‘lsa)
      if (
        json.status_id === OrderStatus.READING &&
        json.finished_at &&
        now.isAfter(dayjs(json.finished_at))
      ) {
        json.status_id = OrderStatus.RETURN_DUE;
      }

      return {
        ...json,
        status_message: getOrderStatusMessage(json),
      };
    });

    return sendSuccess(res, {
      message: "Buyurtmalar ro‘yxati",
      data: ordersWithStatus,
      statusCode: 200,
    });
  }
);

// @router GET /api/v1/user-order/:id
// @desc Bitta buyurtmani olish
// @access Public
export const getUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await UserOrder.findByPk(id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "full_name", "phone", "telegram_id"],
        },
        {
          model: Book,
          as: "Book",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!order) throw new Error("Buyurtma topilmadi");

    return sendSuccess(res, {
      message: "Buyurtma topildi",
      data: {
        ...order.toJSON(),
        status_message: getOrderStatusMessage(order),
      },
      statusCode: 200,
    });
  }
);

// @router PUT /api/v1/user-order/:id
// @desc Buyurtmani to‘liq yangilash (admin tomonidan status_id o‘zgaradi)
// @access Public
export const updateUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await UserOrder.findByPk(id);
    if (!order) throw new Error("Buyurtma topilmadi");

    const updated = await order.update(req.body);

    return sendSuccess(res, {
      message: "Buyurtma yangilandi",
      data: updated,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/v1/user-order/:id
// @desc Buyurtmani o‘chirish
// @access Public
export const deleteUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await UserOrder.findByPk(id);
    if (!order) throw new Error("Buyurtma topilmadi");

    await order.destroy();

    return sendSuccess(res, {
      message: "Buyurtma o'chirildi",
      data: null,
      statusCode: 200,
    });
  }
);

// @router PATCH /api/v1/user-order/:id/extend
// @desc Buyurtmani uzaytirish (20 kundan keyin +5 kun)
// @access Public
export const extendUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await UserOrder.findByPk(id);
    if (!order) throw new Error("Buyurtma topilmadi");

    const today = dayjs();
    const finishedAt = dayjs(order.getDataValue("finished_at"));

    if (today.isBefore(finishedAt)) {
      return res
        .status(400)
        .json({ message: "Buyurtmani hali uzaytirib bo‘lmaydi" });
    }

    if (order.getDataValue("taking_at")) {
      return res
        .status(400)
        .json({ message: "Buyurtma allaqachon uzaytirilgan" });
    }

    const extended = finishedAt.add(5, "day");

    await order.update({
      finished_at: extended.toDate(),
      taking_at: today.toDate(),
      status_id: OrderStatus.EXTENDED,
    });

    return sendSuccess(res, {
      message: "Buyurtma 5 kunga uzaytirildi",
      data: order,
      statusCode: 200,
    });
  }
);

// @router POST /api/v1/user-order/:id/return
// @desc Buyurtmani qaytarish
// @access Public
export const returnUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await UserOrder.findByPk(id);
    if (!order) throw new Error("Buyurtma topilmadi");

    const today = dayjs();
    const finishedAt = dayjs(order.getDataValue("finished_at"));

    if (today.isBefore(finishedAt)) {
      return res
        .status(400)
        .json({ message: "Buyurtmani hali qaytarib bo‘lmaydi" });
    }

    if (!order.getDataValue("taking_at")) {
      return res
        .status(400)
        .json({ message: "Buyurtma allaqachon qaytarilgan" });
    }

    await order.update({
      finished_at: null,
      taking_at: null,
      status_id: OrderStatus.CREATED,
    });

    return sendSuccess(res, {
      message: "Buyurtma qaytarildi",
      data: order,
      statusCode: 200,
    });
  }
);

// @router POST /api/v1/user-order/:id/confirm
// @desc Admin buyurtmani tasdiqlaydi (kitobni topshiradi)
// @access Admin
export const confirmUserOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { book_code } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Admin aniqlanmadi" });
    }

    const admin_id = req.user.id;

    const order = (await UserOrder.findByPk(id)) as UserOrderInstance;
    if (!order) throw new Error("Buyurtma topilmadi");

    if (order.status_id !== OrderStatus.READY_FOR_PICKUP) {
      return res.status(400).json({
        message: "Buyurtma hali tasdiqlash uchun tayyor emas",
      });
    }

    // 🟢 Kitobni topamiz
    const book = await Book.findByPk(order.book_id);
    if (!book) throw new Error("Kitob topilmadi");

    const currentCount = book.getDataValue("book_count");

    if (currentCount <= 0) {
      return res
        .status(400)
        .json({ message: "Kitob zaxirasi tugagan, topshirish mumkin emas" });
    }

    await book.update({
      book_count: currentCount - 1,
    });

    const now = dayjs();

    await order.update({
      status_id: OrderStatus.READING,
      book_code,
      taking_at: now.toDate(),
      finished_at: now.add(20, "day").toDate(),
    });

    await BookGiven.create({
      user_order_id: order.id,
      admin_id,
      given_at: now.toDate(),
    });

    return sendSuccess(res, {
      message: "Kitob foydalanuvchiga topshirildi",
      data: order,
    });
  }
);

// @router Get  /api/v1/user-order/:id
// @desc Buyurtmani olish
// @access Public
export const markOrderReadyForPickup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = (await UserOrder.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
        attributes: ["full_name", "telegram_id", "language"],
      },
      {
        model: Book,
        as: "Book",
        attributes: ["name"],
      },
    ],
  })) as UserOrderInstance;

  if (!order) throw new Error("Buyurtma topilmadi");

  if (order.status_id !== OrderStatus.CREATED) {
    return res
      .status(400)
      .json({ message: "Buyurtma allaqachon qayta ishlangan" });
  }

  await order.update({
    status_id: OrderStatus.READY_FOR_PICKUP,
  });

  // ✅ Telegramga habar yuborish
  const fullName = order.User?.full_name || "foydalanuvchi";
  const telegramId = order.User?.telegram_id;
  const language = order.User?.language || "uz";
  const bookName = order.Book?.name || "kitob";

  let message = "";

  if (language === "ru") {
    message = `<b>${fullName}</b>, Ваша заказанная книга <b>${bookName}</b> готова. Пожалуйста, приходите за ней.`;
  } else {
    message = `<b>${fullName}</b>, buyurtma qilgan <b>${bookName}</b> kitobingiz tayyor! Kelib olib ketishingiz mumkin.`;
  }

  if (telegramId) {
    await sendTelegramMessage(telegramId, message);
  }

  return sendSuccess(res, {
    message: "Kitob olib ketish uchun tayyorlandi",
    data: order,
    statusCode: 200,
  });
});

// @router Patch /api/user-order/:id/return
// @desc Admin Foydalanuvchini buyurmasini bekor qilishi bekor qilish uchun
// @access Provite
export const rejectUserOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = (await UserOrder.findByPk(id, {
    include: [
      {
        model: User,
        as: "User",
        attributes: ["full_name", "telegram_id", "language"],
      },
      {
        model: Book,
        as: "Book",
        attributes: ["name"],
      },
    ],
  })) as UserOrderInstance;

  if (!order) throw new Error("Buyurtma topilmadi");
  if (order.status_id !== OrderStatus.CREATED) {
    return res
      .status(400)
      .json({ message: "Buyurtma allaqachon qayta ishlangan" });
  }

  const fullName = order.User?.full_name || "Student";
  const telegramId = order.User?.telegram_id;
  const language = order.User?.language || "uz";
  const bookName = order.Book?.name || "kitob";
  let message = "";
  if (language === "ru") {
    message = `<b>${fullName}</b>,  ваш заказ на книгу <b>${bookName}</b> отменен.`;
  } else {
    message = `<b>${fullName}</b>, siz buyurtma qilgan <b>${bookName}</b> kitobingiz bekor qilindi.`;
  }
  try {
    if (telegramId) {
      await sendTelegramMessage(telegramId, message);
    }
    await order.update({
      status_id: OrderStatus.REJECTED,
    });
  } catch (error) {
    console.error("Telegram xabari yuborishda xatolik:", error);
  }

  return sendSuccess(res, {
    message: "Buyurtma bekor qilindi",
    data: order,
    statusCode: 200,
  });
});
// @router POST /api/v1/user-order/:id/return-check
// @desc Foydalanuvchi kitobni topshirganda, book_code orqali tekshirib qayta CREATED qilish
// @access Admin
export const returnBookWithCheck = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { book_code } = req.body;

    const order = (await UserOrder.findByPk(id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["full_name", "telegram_id", "language"],
        },
        {
          model: Book,
          as: "Book",
          attributes: ["id", "name"],
        },
      ],
    })) as UserOrderInstance;

    if (!order) throw new Error("Buyurtma topilmadi");

    if (
      ![
        OrderStatus.READING,
        OrderStatus.RETURN_DUE,
        OrderStatus.EXTENDED,
      ].includes(order.status_id)
    ) {
      return res.status(400).json({
        message: "Kitob hali o'qilayotgan yoki topshirish vaqti kelmagan",
      });
    }

    if (order.book_code !== book_code) {
      return res.status(400).json({
        message: "Kitob kodi noto‘g‘ri yoki bu buyurtmaga tegishli emas",
      });
    }

    // 🟢 Kitobni Model sifatida olib kelamiz
    const book = await Book.findByPk(order.book_id);
    if (book) {
      const count = (book.get("book_count") as number) ?? 0;
      await book.update({
        book_count: count + 1,
      });
    }

    await order.update({
      status_id: OrderStatus.ARCHIVED,
      book_code: null,
      taking_at: null,
      finished_at: null,
    });

    await OrderHistory.create({
      user_order_id: order.id,
      action: "RETURNED",
      performed_by: req.user?.id,
    });

    // Telegram xabar
    const fullName = order.User?.full_name || "foydalanuvchi";
    const telegramId = order.User?.telegram_id;
    const language = order.User?.language || "uz";
    const bookName = order.Book?.name || "kitob";

    let message = "";
    if (language === "ru") {
      message = `<b>${fullName}</b>, вы успешно вернули книгу <b>${bookName}</b>. Спасибо!`;
    } else {
      message = `<b>${fullName}</b>, siz <b>${bookName}</b> kitobingizni muvaffaqiyatli topshirdingiz. Rahmat!`;
    }

    if (telegramId) {
      await sendTelegramMessage(telegramId, message);
    }

    return sendSuccess(res, {
      message: "Kitob muvaffaqiyatli topshirildi",
      data: order,
      statusCode: 200,
    });
  }
);

// @route PATCH /api/user-order/:id/remove-blacklist
// @desc Admin foydalanuvchini qora ro'yxatdan chiqaradi va kitob zaxirasini oshiradi
// @access Private
export const removeFromBlacklist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = (await UserOrder.findByPk(id)) as UserOrderInstance;

  if (!order) {
    return res.status(404).json({ message: "Buyurtma topilmadi" });
  }

  if (order.status_id !== OrderStatus.OVERDUE) {
    return res.status(400).json({ message: "Bu buyurtma qora ro'yxatda emas" });
  }

  // 🟢 Kitobni alohida model sifatida topamiz
  const book = await Book.findByPk(order.book_id);
  if (book) {
    const count = book.getDataValue("book_count") ?? 0;
    await book.update({
      book_count: count + 1,
    });
  }

  // 🟢 Buyurtmani arxivga o‘tkazamiz
  await order.update({
    status_id: OrderStatus.ARCHIVED,
    book_code: null,
    taking_at: null,
    finished_at: null,
  });

  return sendSuccess(res, {
    message: "Buyurtma qora ro'yxatdan chiqarildi va kitob zaxiraga qo‘shildi",
    data: order,
    statusCode: 200,
  });
});
// @router GET /api/v1/user-order/user/:user_id
// @desc Foydalanuvchining barcha buyurtmalarini olish
// @access Public
export const getUserOrdersByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    const orders = await UserOrder.findAll({
      where: { user_id: +user_id },
      include: [
        {
          model: Book,
          as: "Book",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const now = dayjs();

    const ordersWithStatus = orders.map((order) => {
      const json = order.toJSON();
      if (
        json.status_id === OrderStatus.READING &&
        json.finished_at &&
        now.isAfter(dayjs(json.finished_at))
      ) {
        json.status_id = OrderStatus.RETURN_DUE;
      }

      return {
        ...json,
        status_message: getOrderStatusMessage(json),
      };
    });

    return sendSuccess(res, {
      message: "Foydalanuvchining barcha buyurtmalari",
      data: ordersWithStatus,
      statusCode: 200,
    });
  }
);
