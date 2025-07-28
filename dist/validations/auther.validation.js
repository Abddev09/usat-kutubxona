"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAutherSchema = exports.createAutherSchema = void 0;
const zod_1 = require("zod");
exports.createAutherSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Ism kamida 2 harf bo‘lishi kerak"),
    }),
};
exports.updateAutherSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({ name: zod_1.z.string().min(2) }),
};
