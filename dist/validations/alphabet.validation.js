"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAlphabetSchema = exports.createAlphabetSchema = void 0;
// validations/alphabet.validation.ts
const zod_1 = require("zod");
exports.createAlphabetSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name bo‘sh bo‘lmasligi kerak"),
    }),
};
exports.updateAlphabetSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, "ID raqam bo‘lishi kerak"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
    }),
};
