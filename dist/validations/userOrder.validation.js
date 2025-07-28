"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmUserOrderSchema = exports.extendUserOrderSchema = exports.updateUserOrderSchema = exports.createUserOrderSchema = void 0;
const zod_1 = require("zod");
exports.createUserOrderSchema = {
    body: zod_1.z.object({
        user_id: zod_1.z.number(),
        book_id: zod_1.z.number(),
    }),
};
exports.updateUserOrderSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        user_id: zod_1.z.number(),
        book_id: zod_1.z.number(),
    }),
};
exports.extendUserOrderSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
};
exports.confirmUserOrderSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        book_code: zod_1.z.string().min(3, "Kitob kod 3 ta hafirdan ko'p bo'lishi kerak"),
    }),
};
