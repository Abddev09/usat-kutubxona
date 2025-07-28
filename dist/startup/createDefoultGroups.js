"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultGroups = void 0;
const models_1 = require("../models");
const defaultGroups = [
    { name: "Admin", can_login: true },
    { name: "Kutubxona xodimi", can_login: true },
    { name: "Student", can_login: false },
    { name: "Dekanat", can_login: true },
    { name: "Rektorat", can_login: true },
    { name: "O'qituvchi", can_login: true },
];
const createDefaultGroups = async () => {
    const createdGroups = [];
    // Barcha tekshiruvlarni parallel qilib yuboramiz
    await Promise.all(defaultGroups.map(async (group) => {
        const exists = await models_1.Group.findOne({
            where: { name: group.name },
        });
        if (!exists) {
            await models_1.Group.create({
                name: group.name,
                can_login: group.can_login,
            });
            createdGroups.push(group.name);
        }
    }));
    // Yakuniy natijani chiqarish
    if (createdGroups.length > 0) {
        console.log(`✅ Quyidagi guruhlar yaratildi: ${createdGroups.join(", ")}`);
    }
    else {
        console.log(`ℹ️ Barcha guruhlar oldin yaratilgan, yangisi qo'shilmadi.`);
    }
};
exports.createDefaultGroups = createDefaultGroups;
