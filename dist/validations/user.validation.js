"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = {
    body: zod_1.z.object({
        full_name: zod_1.z
            .string()
            .min(3, "Ism kamida 3 ta belgidan iborat bo‘lishi kerak"),
        passport_id: zod_1.z
            .string()
            .min(6, "Passport ID 6 ta hafirdan ko'p bo'lishi kerak"),
        phone: zod_1.z.string().min(9, "Telefon raqam noto‘g‘ri"),
        password: zod_1.z
            .string()
            .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
        student_group_id: zod_1.z.number(),
        telegram_id: zod_1.z.number(),
    }),
};
exports.updateUserSchema = {
    body: zod_1.z.object({
        full_name: zod_1.z
            .string()
            .min(3, "Ism kamida 3 ta belgidan iborat bo‘lishi kerak"),
        passport_id: zod_1.z
            .string()
            .min(6, "Passport ID 6 ta hafirdan ko'p bo'lishi kerak"),
        phone: zod_1.z.string().min(9, "Telefon raqam noto‘g‘ri"),
        password: zod_1.z
            .string()
            .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
    }),
};
