"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYonalishSchema = exports.createYonalishSchema = void 0;
const zod_1 = require("zod");
exports.createYonalishSchema = {
    body: zod_1.z.object({
        name_uz: zod_1.z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
        name_ru: zod_1.z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
    }),
};
exports.updateYonalishSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        name_uz: zod_1.z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
        name_ru: zod_1.z.string().min(2, "Название должно содержать не менее 2 букв"),
    }),
};
