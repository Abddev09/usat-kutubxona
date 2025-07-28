"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrdersByUserId = exports.removeFromBlacklist = exports.returnBookWithCheck = exports.rejectUserOrder = exports.markOrderReadyForPickup = exports.confirmUserOrder = exports.returnUserOrder = exports.extendUserOrder = exports.deleteUserOrder = exports.updateUserOrder = exports.getUserOrder = exports.getAllUserOrders = exports.createUserOrder = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const UserOrder_1 = require("../models/UserOrder");
const responseHandler_1 = require("../utils/responseHandler");
const dayjs_1 = __importDefault(require("dayjs"));
const orderStatusMessage_1 = require("../utils/orderStatusMessage");
const statusOrder_1 = require("../constants/statusOrder");
const models_1 = require("../models");
const sendTelegramMessage_1 = require("../utils/sendTelegramMessage");
const sequelize_1 = require("sequelize");
const OrderHistory_1 = require("../models/OrderHistory");
const BookGiven_1 = require("../models/BookGiven");
// @router POST /api/v1/user-order
// @desc Buyurtma yaratish
// @access Public
exports.createUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user_id, book_id } = req.body;
    const userOrderFindUser = await models_1.User.findByPk(user_id);
    if (!userOrderFindUser)
        throw new Error("Foydalanuvchi topilmadi");
    const userOrderFindBook = await models_1.Book.findByPk(book_id);
    if (!userOrderFindBook)
        throw new Error("Kitob topilmadi");
    const existingOrder = await UserOrder_1.UserOrder.findOne({
        where: {
            user_id,
            book_id,
            status_id: {
                [sequelize_1.Op.in]: [
                    statusOrder_1.OrderStatus.CREATED,
                    statusOrder_1.OrderStatus.READY_FOR_PICKUP,
                    statusOrder_1.OrderStatus.READING,
                    statusOrder_1.OrderStatus.EXTENDED,
                ],
            },
        },
    });
    if (existingOrder)
        throw new Error("Buyurtma allaqachon mavjud");
    const now = (0, dayjs_1.default)();
    const userOrder = await UserOrder_1.UserOrder.create({
        user_id,
        book_id,
        status_id: statusOrder_1.OrderStatus.CREATED,
        book_code: null,
        created_at: now.toDate(),
        taking_at: null,
        finished_at: null,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma yaratildi",
        data: userOrder,
        statusCode: 200,
    });
});
// @router GET /api/v1/user-order
// @desc Barcha buyurtmalarni olish
// @access Public
exports.getAllUserOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status } = req.query;
    const whereClause = {};
    // Faqat status bo‘yicha filter kelsa qo‘shamiz
    if (status) {
        whereClause.status_id = +status; // query string bo‘lgani uchun raqamga aylantiramiz
    }
    const orders = await UserOrder_1.UserOrder.findAll({
        where: whereClause,
        include: [
            {
                model: models_1.User,
                as: "User",
                attributes: ["id", "full_name", "phone", "telegram_id"],
            },
            {
                model: models_1.Book,
                as: "Book",
                attributes: ["id", "name"],
            },
        ],
        order: [["created_at", "DESC"]],
    });
    const now = (0, dayjs_1.default)();
    const ordersWithStatus = orders.map((order) => {
        const json = order.toJSON();
        // Dinamik RETURN_DUE qilish (agar filterlanganda ham kerak bo‘lsa)
        if (json.status_id === statusOrder_1.OrderStatus.READING &&
            json.finished_at &&
            now.isAfter((0, dayjs_1.default)(json.finished_at))) {
            json.status_id = statusOrder_1.OrderStatus.RETURN_DUE;
        }
        return {
            ...json,
            status_message: (0, orderStatusMessage_1.getOrderStatusMessage)(json),
        };
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtmalar ro‘yxati",
        data: ordersWithStatus,
        statusCode: 200,
    });
});
// @router GET /api/v1/user-order/:id
// @desc Bitta buyurtmani olish
// @access Public
exports.getUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await UserOrder_1.UserOrder.findByPk(id, {
        include: [
            {
                model: models_1.User,
                as: "User",
                attributes: ["id", "full_name", "phone", "telegram_id"],
            },
            {
                model: models_1.Book,
                as: "Book",
                attributes: ["id", "name"],
            },
        ],
    });
    if (!order)
        throw new Error("Buyurtma topilmadi");
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma topildi",
        data: {
            ...order.toJSON(),
            status_message: (0, orderStatusMessage_1.getOrderStatusMessage)(order),
        },
        statusCode: 200,
    });
});
// @router PUT /api/v1/user-order/:id
// @desc Buyurtmani to‘liq yangilash (admin tomonidan status_id o‘zgaradi)
// @access Public
exports.updateUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await UserOrder_1.UserOrder.findByPk(id);
    if (!order)
        throw new Error("Buyurtma topilmadi");
    const updated = await order.update(req.body);
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma yangilandi",
        data: updated,
        statusCode: 200,
    });
});
// @router DELETE /api/v1/user-order/:id
// @desc Buyurtmani o‘chirish
// @access Public
exports.deleteUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await UserOrder_1.UserOrder.findByPk(id);
    if (!order)
        throw new Error("Buyurtma topilmadi");
    await order.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma o'chirildi",
        data: null,
        statusCode: 200,
    });
});
// @router PATCH /api/v1/user-order/:id/extend
// @desc Buyurtmani uzaytirish (20 kundan keyin +5 kun)
// @access Public
exports.extendUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await UserOrder_1.UserOrder.findByPk(id);
    if (!order)
        throw new Error("Buyurtma topilmadi");
    const today = (0, dayjs_1.default)();
    const finishedAt = (0, dayjs_1.default)(order.getDataValue("finished_at"));
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
        status_id: statusOrder_1.OrderStatus.EXTENDED,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma 5 kunga uzaytirildi",
        data: order,
        statusCode: 200,
    });
});
// @router POST /api/v1/user-order/:id/return
// @desc Buyurtmani qaytarish
// @access Public
exports.returnUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await UserOrder_1.UserOrder.findByPk(id);
    if (!order)
        throw new Error("Buyurtma topilmadi");
    const today = (0, dayjs_1.default)();
    const finishedAt = (0, dayjs_1.default)(order.getDataValue("finished_at"));
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
        status_id: statusOrder_1.OrderStatus.CREATED,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma qaytarildi",
        data: order,
        statusCode: 200,
    });
});
// @router POST /api/v1/user-order/:id/confirm
// @desc Admin buyurtmani tasdiqlaydi (kitobni topshiradi)
// @access Admin
exports.confirmUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { book_code } = req.body;
    if (!req.user?.id) {
        return res.status(401).json({ message: "Admin aniqlanmadi" });
    }
    const admin_id = req.user.id;
    const order = (await UserOrder_1.UserOrder.findByPk(id));
    if (!order)
        throw new Error("Buyurtma topilmadi");
    if (order.status_id !== statusOrder_1.OrderStatus.READY_FOR_PICKUP) {
        return res.status(400).json({
            message: "Buyurtma hali tasdiqlash uchun tayyor emas",
        });
    }
    // 🟢 Kitobni topamiz
    const book = await models_1.Book.findByPk(order.book_id);
    if (!book)
        throw new Error("Kitob topilmadi");
    const currentCount = book.getDataValue("book_count");
    if (currentCount <= 0) {
        return res
            .status(400)
            .json({ message: "Kitob zaxirasi tugagan, topshirish mumkin emas" });
    }
    await book.update({
        book_count: currentCount - 1,
    });
    const now = (0, dayjs_1.default)();
    await order.update({
        status_id: statusOrder_1.OrderStatus.READING,
        book_code,
        taking_at: now.toDate(),
        finished_at: now.add(20, "day").toDate(),
    });
    await BookGiven_1.BookGiven.create({
        user_order_id: order.id,
        admin_id,
        given_at: now.toDate(),
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob foydalanuvchiga topshirildi",
        data: order,
    });
});
// @router Get  /api/v1/user-order/:id
// @desc Buyurtmani olish
// @access Public
exports.markOrderReadyForPickup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = (await UserOrder_1.UserOrder.findByPk(id, {
        include: [
            {
                model: models_1.User,
                as: "User",
                attributes: ["full_name", "telegram_id", "language"],
            },
            {
                model: models_1.Book,
                as: "Book",
                attributes: ["name"],
            },
        ],
    }));
    if (!order)
        throw new Error("Buyurtma topilmadi");
    if (order.status_id !== statusOrder_1.OrderStatus.CREATED) {
        return res
            .status(400)
            .json({ message: "Buyurtma allaqachon qayta ishlangan" });
    }
    await order.update({
        status_id: statusOrder_1.OrderStatus.READY_FOR_PICKUP,
    });
    // ✅ Telegramga habar yuborish
    const fullName = order.User?.full_name || "foydalanuvchi";
    const telegramId = order.User?.telegram_id;
    const language = order.User?.language || "uz";
    const bookName = order.Book?.name || "kitob";
    let message = "";
    if (language === "ru") {
        message = `<b>${fullName}</b>, Ваша заказанная книга <b>${bookName}</b> готова. Пожалуйста, приходите за ней.`;
    }
    else {
        message = `<b>${fullName}</b>, buyurtma qilgan <b>${bookName}</b> kitobingiz tayyor! Kelib olib ketishingiz mumkin.`;
    }
    if (telegramId) {
        await (0, sendTelegramMessage_1.sendTelegramMessage)(telegramId, message);
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob olib ketish uchun tayyorlandi",
        data: order,
        statusCode: 200,
    });
});
// @router Patch /api/user-order/:id/return
// @desc Admin Foydalanuvchini buyurmasini bekor qilishi bekor qilish uchun
// @access Provite
exports.rejectUserOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = (await UserOrder_1.UserOrder.findByPk(id, {
        include: [
            {
                model: models_1.User,
                as: "User",
                attributes: ["full_name", "telegram_id", "language"],
            },
            {
                model: models_1.Book,
                as: "Book",
                attributes: ["name"],
            },
        ],
    }));
    if (!order)
        throw new Error("Buyurtma topilmadi");
    if (order.status_id !== statusOrder_1.OrderStatus.CREATED) {
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
    }
    else {
        message = `<b>${fullName}</b>, siz buyurtma qilgan <b>${bookName}</b> kitobingiz bekor qilindi.`;
    }
    try {
        if (telegramId) {
            await (0, sendTelegramMessage_1.sendTelegramMessage)(telegramId, message);
        }
        await order.update({
            status_id: statusOrder_1.OrderStatus.REJECTED,
        });
    }
    catch (error) {
        console.error("Telegram xabari yuborishda xatolik:", error);
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma bekor qilindi",
        data: order,
        statusCode: 200,
    });
});
// @router POST /api/v1/user-order/:id/return-check
// @desc Foydalanuvchi kitobni topshirganda, book_code orqali tekshirib qayta CREATED qilish
// @access Admin
exports.returnBookWithCheck = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { book_code } = req.body;
    const order = (await UserOrder_1.UserOrder.findByPk(id, {
        include: [
            {
                model: models_1.User,
                as: "User",
                attributes: ["full_name", "telegram_id", "language"],
            },
            {
                model: models_1.Book,
                as: "Book",
                attributes: ["id", "name"],
            },
        ],
    }));
    if (!order)
        throw new Error("Buyurtma topilmadi");
    if (![
        statusOrder_1.OrderStatus.READING,
        statusOrder_1.OrderStatus.RETURN_DUE,
        statusOrder_1.OrderStatus.EXTENDED,
    ].includes(order.status_id)) {
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
    const book = await models_1.Book.findByPk(order.book_id);
    if (book) {
        const count = book.get("book_count") ?? 0;
        await book.update({
            book_count: count + 1,
        });
    }
    await order.update({
        status_id: statusOrder_1.OrderStatus.ARCHIVED,
        book_code: null,
        taking_at: null,
        finished_at: null,
    });
    await OrderHistory_1.OrderHistory.create({
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
    }
    else {
        message = `<b>${fullName}</b>, siz <b>${bookName}</b> kitobingizni muvaffaqiyatli topshirdingiz. Rahmat!`;
    }
    if (telegramId) {
        await (0, sendTelegramMessage_1.sendTelegramMessage)(telegramId, message);
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Kitob muvaffaqiyatli topshirildi",
        data: order,
        statusCode: 200,
    });
});
// @route PATCH /api/user-order/:id/remove-blacklist
// @desc Admin foydalanuvchini qora ro'yxatdan chiqaradi va kitob zaxirasini oshiradi
// @access Private
exports.removeFromBlacklist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = (await UserOrder_1.UserOrder.findByPk(id));
    if (!order) {
        return res.status(404).json({ message: "Buyurtma topilmadi" });
    }
    if (order.status_id !== statusOrder_1.OrderStatus.OVERDUE) {
        return res.status(400).json({ message: "Bu buyurtma qora ro'yxatda emas" });
    }
    // 🟢 Kitobni alohida model sifatida topamiz
    const book = await models_1.Book.findByPk(order.book_id);
    if (book) {
        const count = book.getDataValue("book_count") ?? 0;
        await book.update({
            book_count: count + 1,
        });
    }
    // 🟢 Buyurtmani arxivga o‘tkazamiz
    await order.update({
        status_id: statusOrder_1.OrderStatus.ARCHIVED,
        book_code: null,
        taking_at: null,
        finished_at: null,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Buyurtma qora ro'yxatdan chiqarildi va kitob zaxiraga qo‘shildi",
        data: order,
        statusCode: 200,
    });
});
// @router GET /api/v1/user-order/user/:user_id
// @desc Foydalanuvchining barcha buyurtmalarini olish
// @access Public
exports.getUserOrdersByUserId = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user_id } = req.params;
    const user = await models_1.User.findByPk(user_id);
    if (!user) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    const orders = await UserOrder_1.UserOrder.findAll({
        where: { user_id: +user_id },
        include: [
            {
                model: models_1.Book,
                as: "Book",
            },
        ],
        order: [["created_at", "DESC"]],
    });
    const now = (0, dayjs_1.default)();
    const ordersWithStatus = orders.map((order) => {
        const json = order.toJSON();
        if (json.status_id === statusOrder_1.OrderStatus.READING &&
            json.finished_at &&
            now.isAfter((0, dayjs_1.default)(json.finished_at))) {
            json.status_id = statusOrder_1.OrderStatus.RETURN_DUE;
        }
        return {
            ...json,
            status_message: (0, orderStatusMessage_1.getOrderStatusMessage)(json),
        };
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Foydalanuvchining barcha buyurtmalari",
        data: ordersWithStatus,
        statusCode: 200,
    });
});
