"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserGroupSchema = void 0;
const zod_1 = require("zod");
exports.createUserGroupSchema = {
    body: zod_1.z.object({
        user_id: zod_1.z.number(),
        group_id: zod_1.z.number(),
    }),
};
