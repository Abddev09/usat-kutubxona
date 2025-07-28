import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middlewares/asyncHandler";
import { User, UserGroup, Group } from "../models/";
import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/responseHandler";
import { UserGroupInstance, UserInstance } from "../types/models";
import dotenv from "dotenv";
dotenv.config();
// @router POST /api/login
// @desc Foydalanuvchini login qilish
// @access Public
export const LoginPage = asyncHandler(async (req: Request, res: Response) => {
  const { passport_id, password } = req.body;

  // 1. Foydalanuvchini topamiz
  const user = (await User.findOne({
    where: { passport_id },
  })) as UserInstance;

  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }

  // 2. Parolni tekshiramiz
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Parol noto‘g‘ri");
  }

  // 3. Foydalanuvchining guruhlarini olish
  const userGroups = (await UserGroup.findAll({
    where: { user_id: user.id },
    include: [{ model: Group, as: "groupInfo" }],
  })) as UserGroupInstance[];

  // 4. Login huquqi bor guruhlarni ajratib olish
  const allowedGroups = userGroups.filter((ug) => ug.groupInfo?.can_login);

  if (allowedGroups.length === 0) {
    throw new ApiError(403, "Siz tizimga kira olmaysiz. Ruxsat yo‘q.");
  }

  // 5. JWT token tayyorlash
  const groupIds = allowedGroups.map((ug) => ug.group_id);
  const firstAllowedGroup = allowedGroups[0].groupInfo!.name.toLowerCase(); // optional, faqat birinchi group role sifatida

  const token = jwt.sign(
    {
      id: user.id,
      groupIds,
      role: firstAllowedGroup,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  // 6. Parolni yubormaslik
  const { password: _, ...safeUser } = user.get({ plain: true });
  const safeUserGroups = userGroups.map((ug) => {
    const { groupInfo: _, ...safeUg } = ug.get({ plain: true });
    return safeUg;
  });

  return sendSuccess(res, {
    message: "Muvaffaqiyatli login qilindi",
    data: {
      ...safeUser,
      userGroups,
      token,
    },
    statusCode: 200,
  });
});

// @router POST /api/register
// @desc Foydalanuvchini ro'yxatdan o'tkazish
// @access Public
export const RegisterPage = asyncHandler(
  async (req: Request, res: Response) => {
    const { full_name, passport_id, phone, password, group_id } = req.body;
    const existingUser = await User.findOne({ where: { passport_id } });
    if (existingUser) {
      throw new ApiError(
        409,
        "Ushbu passport ID bilan foydalanuvchi allaqachon mavjud"
      );
    }
    const group = await Group.findByPk(group_id);
    if (!group) {
      throw new ApiError(404, "Tanlangan rol mavjud emas");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = (await User.create({
      full_name,
      passport_id,
      phone,
      password: hashedPassword,
    })) as UserInstance;
    await UserGroup.create({
      user_id: newUser.id,
      group_id: (group?.get("id") as number) || group_id,
    });
    const { password: _, ...safeUser } = newUser.get({ plain: true });

    return sendSuccess(res, {
      message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi",
      data: safeUser,
      statusCode: 201,
    });
  }
);
// @router GET /api/users
// @desc Foydalanuvchilarni ko'rish
// @access Private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserGroup.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "full_name", "passport_id", "phone"],
        as: "user",
      },
      {
        model: Group,
        attributes: ["id", "name"],
        as: "groupInfo",
      },
    ],
  });
  return sendSuccess(res, {
    message: "Foydalanuvchilar topildi",
    data: users,
    statusCode: 200,
  });
});
// @router Get /api/users/:id
// @desc Foydalanuvchini ko'rish
// @access Private
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await UserGroup.findByPk(id);
  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }
  return sendSuccess(res, {
    message: "Foydalanuvchi topildi",
    data: user,
    statusCode: 200,
  });
});
// @router DELETE /api/users/:id
// @desc Foydalanuvchini o'chirish
// @access Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await UserGroup.findByPk(id);
  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }
  await user.destroy();
  return sendSuccess(res, {
    message: "Foydalanuvchi muvaffaqiyatli o'chirildi",
    statusCode: 200,
  });
});
// @router PATCH /api/users/:id
// @desc Foydalanuvchini o'zgartirish
// @access Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { full_name, passport_id, phone, group_id } = req.body;

  const user = (await User.findByPk(id)) as UserInstance;
  if (!user) {
    throw new ApiError(404, "Foydalanuvchi topilmadi");
  }

  // 1. USER'ni yangilaymiz
  await user.update({
    full_name,
    passport_id,
    phone,
  });

  // 2. GROUP borligini tekshiramiz (optional)
  if (group_id) {
    const group = await Group.findByPk(group_id);
    if (!group) {
      throw new ApiError(404, "Tanlangan rol mavjud emas");
    }

    // 3. UserGroupni topib, yangilaymiz
    const userGroup = (await UserGroup.findOne({
      where: { user_id: user.id },
    })) as UserGroupInstance;

    if (userGroup) {
      await userGroup.update({ group_id });
    } else {
      // User oldin yoq bo'lgan bo‘lsa, qo‘shib qo‘yamiz
      await UserGroup.create({
        user_id: user.id,
        group_id,
      });
    }
  }

  const { password: _, ...safeUser } = user.get({ plain: true });

  return sendSuccess(res, {
    message: "Foydalanuvchi muvaffaqiyatli o‘zgartirildi",
    data: safeUser,
    statusCode: 200,
  });
});
