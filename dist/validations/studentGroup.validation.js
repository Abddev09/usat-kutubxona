"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentGroupSchema = exports.createStudentGroupSchema = void 0;
const zod_1 = require("zod");
exports.createStudentGroupSchema = {
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Student group nomi 3 ta hafirdan ko'p bo'lishi kerak"),
        yonalish_id: zod_1.z.number(),
    }),
};
exports.updateStudentGroupSchema = {
    params: zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(3, "Student group nomi 3 ta hafirdan ko'p bo'lishi kerak"),
        yonalish_id: zod_1.z.number(),
    }),
};
