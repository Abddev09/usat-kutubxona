"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupPermissionSchema = void 0;
const zod_1 = require("zod");
exports.createGroupPermissionSchema = {
    body: zod_1.z.object({
        group_id: zod_1.z.number().int(),
        permission_id: zod_1.z.number().int(),
    }),
};
