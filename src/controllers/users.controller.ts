import { Request, Response } from "express";
import { User } from "../models/User";
import { sendSuccess } from "../utils/responseHandler";
import { asyncHandler } from "../middlewares/asyncHandler";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError";
import { Group, UserGroup } from "../models";
import { UserInstance } from "../types/models";
// @router GET /api/users
// @desc Barcha foydalanuvchilar
// @access Public
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.findAll();
  return sendSuccess(res, {
    message: "Barcha foydalanuvchilar",
    data: users,
    statusCode: 200,
  });
});
// router POST /api/users/register
// @desc Registiratsiyadan o'tkazish
//@access Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      full_name,
      passport_id,
      phone,
      password,
      student_group_id,
      telegram_id,
      language,
    } = req.body;

    // 1. Unikal tekshiruvlar
    const [existingUser, existingTelegram, existingPhone] = await Promise.all([
      User.findOne({ where: { passport_id } }),
      telegram_id ? User.findOne({ where: { telegram_id } }) : null,
      User.findOne({ where: { phone } }),
    ]);

    if (existingUser) throw new ApiError(409, "Passport ID mavjud");
    if (existingTelegram)
      throw new ApiError(409, "Telegram ID allaqachon mavjud");
    if (existingPhone)
      throw new ApiError(409, "Telefon raqam allaqachon mavjud");

    // 2. Parolni xeshlash
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS) || 10
    );

    // 3. Foydalanuvchini yaratish
    const newUser = await User.create({
      full_name: full_name.trim(),
      passport_id,
      phone,
      password: hashedPassword,
      student_group_id: student_group_id || null,
      telegram_id: telegram_id || null,
      language: language || null,
    });

    // 4. Agar telegram_id mavjud bo‘lsa — Group bilan bog‘lash
    if (telegram_id) {
      const studentGroup = await Group.findOne({
        where: { name: "Student" }, // lowercase
      });

      if (!studentGroup) {
        throw new ApiError(
          500,
          `"Student" nomli group topilmadi. Iltimos, admin orqali yarating.`
        );
      }

      await UserGroup.create({
        user_id: newUser.get("id"),
        group_id: studentGroup.get("id"),
      });
    }

    // 5. Parolsiz user qaytariladi
    const { password: _, ...safeUser } = newUser.get({ plain: true });

    return sendSuccess(res, {
      message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi",
      data: safeUser,
      statusCode: 201,
    });
  }
);

// @router UPDATE /api/users/:id
// @desc Foydalanuvchini o'zgartirish
// @access Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { full_name, passport_id, phone, language } = req.body;
  // Userni borligini tekshirish
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }
  // model instance orqali update qilish — bu eng to‘g‘ri usul
  await user.update({
    full_name,
    passport_id,
    phone,
    language,
  });
  const { password, ...safeUser } = user.get({ plain: true });
  return sendSuccess(res, {
    message: "Foydalanuvchi muvaffaqiyatli o'zgartirildi",
    data: safeUser,
    statusCode: 200,
  });
});
// @router DELETE /api/users/:id
// @desc Foydalanuvchini o'chirish
// @access Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }
  await user.destroy();
  return sendSuccess(res, {
    message: "Foydalanuvchi soft-delete qilindi",
    statusCode: 200,
  });
});
// @router GET /api/users/:id
// @desc Foydalanuvchini ko'rish
// @access Private
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await User.findByPk(id);
  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }
  const { password, ...safeUser } = user.get({ plain: true });
  return sendSuccess(res, {
    message: "Foydalanuvchi topildi",
    data: safeUser,
    statusCode: 200,
  });
});

// @router  GET /api/users/deleted
// @desc O'chirilgan foydalanuvchilar
// @access Private
export const getDeletedUsers = asyncHandler(async (req, res) => {
  const users = (await User.findAll({
    where: {},
    paranoid: false, // o‘chirilganlarni ham olish uchun
  })) as UserInstance[];

  const deletedUsers = users.filter((user) => user.deletedAt !== null);

  return sendSuccess(res, {
    message: "O‘chirilgan foydalanuvchilar ro‘yxati",
    data: deletedUsers,
    statusCode: 200,
  });
});

// @router POST /api//users/:id/restore
// @desc O'chirilgan foydalanuvchini tiklash
// @access Private
export const restoreUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("🔍 Tiklanayotgan ID:", id);

  const user = (await User.findByPk(id, {
    paranoid: false,
  })) as UserInstance;

  if (!user) {
    console.log("❌ User topilmadi");
    return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
  }

  if (user.deletedAt === null) {
    console.log("⚠️ User o‘chirilmagan");
    return res.status(400).json({ message: "Bu foydalanuvchi o‘chirilmagan" });
  }

  await user.restore();
  console.log("✅ Tiklandi:", user.id);

  return sendSuccess(res, {
    message: "Foydalanuvchi tiklandi",
    data: user,
    statusCode: 200,
  });
});
