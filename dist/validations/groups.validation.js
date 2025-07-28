"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupSchema = void 0;
const zod_1 = require("zod");
exports.createGroupSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, "Group nomi 3 ta hafirdan ko'p bo'lishi kerak"),
        can_login: zod_1.z.boolean({ required_error: "can_login bo'lishi kerak" }),
    }),
};
