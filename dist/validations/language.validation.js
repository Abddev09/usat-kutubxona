"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLanguageSchema = exports.createLanguageSchema = void 0;
const zod_1 = require("zod");
exports.createLanguageSchema = {
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Til nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),
    }),
};
exports.updateLanguageSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Til nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),
    }),
};
