"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermissionSchema = void 0;
const zod_1 = require("zod");
exports.createPermissionSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, "Ism 3 ta hafirdan ko'p bo'lishi kerak"),
    }),
};
