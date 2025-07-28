"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookCategorySchema = exports.createBookCategorySchema = void 0;
const zod_1 = require("zod");
exports.createBookCategorySchema = {
    body: zod_1.z.object({
        book_id: zod_1.z.number(),
        category_id: zod_1.z.number(),
    }),
};
exports.updateBookCategorySchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        book_id: zod_1.z.number(),
        category_id: zod_1.z.number(),
    }),
};
