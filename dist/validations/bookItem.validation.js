"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookItemSchema = exports.createBookItemSchema = void 0;
const zod_1 = require("zod");
exports.createBookItemSchema = {
    body: zod_1.z.object({
        book_id: zod_1.z.number(),
        language_id: zod_1.z.number(),
        alphabet_id: zod_1.z.number(),
        status_id: zod_1.z.number(),
    }),
};
exports.updateBookItemSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        book_id: zod_1.z.number(),
        language_id: zod_1.z.number(),
        alphabet_id: zod_1.z.number(),
        status_id: zod_1.z.number(),
    }),
};
