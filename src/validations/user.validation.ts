import { z } from "zod";

export const registerUserSchema = {
  body: z.object({
    full_name: z
      .string()
      .min(3, "Ism kamida 3 ta belgidan iborat bo‘lishi kerak"),
    passport_id: z
      .string()
      .min(6, "Passport ID 6 ta hafirdan ko'p bo'lishi kerak"),
    phone: z.string().min(9, "Telefon raqam noto‘g‘ri"),
    password: z
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
    student_group_id: z.number(),
    telegram_id: z.number(),
  }),
};

export const updateUserSchema = {
  body: z.object({
    full_name: z
      .string()
      .min(3, "Ism kamida 3 ta belgidan iborat bo‘lishi kerak"),
    passport_id: z
      .string()
      .min(6, "Passport ID 6 ta hafirdan ko'p bo'lishi kerak"),
    phone: z.string().min(9, "Telefon raqam noto‘g‘ri"),
    password: z
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
  }),
};
