"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = {
    body: zod_1.z.object({
        name_uz: zod_1.z.string().min(2, "Kategoriya nomi kamida 2 harf bo‘lishi kerak"),
        name_ru: zod_1.z.string().min(2, "Kategoriya nomi kamida 2 harf bo‘lishi kerak"),
    }),
};
exports.updateCategorySchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({ name_uz: zod_1.z.string().min(2), name_ru: zod_1.z.string().min(2) }),
};
