"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateKafedraSchema = exports.createKafedraSchema = void 0;
const zod_1 = require("zod");
exports.createKafedraSchema = {
    body: zod_1.z.object({
        name_uz: zod_1.z.string().min(2, "Kafedra nomi kamida 2 harf bo‘lishi kerak"),
        name_ru: zod_1.z.string().min(2, "Кафедра номи камида 2 ҳарф бўлиши керак"),
    }),
};
exports.updateKafedraSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        name_uz: zod_1.z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
        name_ru: zod_1.z
            .string()
            .min(2, "Название кафедры должно содержать не менее 2 букв"),
    }),
};
