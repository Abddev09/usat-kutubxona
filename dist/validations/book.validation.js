"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookSchema = exports.createBookSchema = void 0;
const zod_1 = require("zod");
exports.createBookSchema = {
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Kitob nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),
        author_id: zod_1.z.coerce.number().optional().nullable(), // string => number
        year: zod_1.z.coerce.number().int().min(1, "Yil to‘g‘ri raqam bo‘lishi kerak"),
        page: zod_1.z.coerce
            .number()
            .int()
            .min(1, "Sahifalar soni to‘g‘ri raqam bo‘lishi kerak"),
        book_count: zod_1.z.coerce
            .number()
            .int()
            .min(1, "Kitob soni to‘g‘ri raqam bo‘lishi kerak"),
        description: zod_1.z.string().optional(),
    }),
};
exports.updateBookSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/),
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Kitob nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),
        author_id: zod_1.z.coerce.number().optional().nullable(),
        year: zod_1.z.coerce.number().int().min(1, "Yil to‘g‘ri raqam bo‘lishi kerak"),
        page: zod_1.z.coerce
            .number()
            .int()
            .min(1, "Sahifalar soni to‘g‘ri raqam bo‘lishi kerak"),
        book_count: zod_1.z.coerce
            .number()
            .int()
            .min(1, "Kitob soni to‘g‘ri raqam bo‘lishi kerak"),
        description: zod_1.z.string().optional(),
    }),
};
