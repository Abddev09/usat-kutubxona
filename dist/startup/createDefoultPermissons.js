"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultPermissions = exports.defaultPermissions = void 0;
const models_1 = require("../models");
exports.defaultPermissions = [
    { code_name: "admin_huquqlari", name: "Admin huquqlari", table: "admin" },
    {
        code_name: "kitob_muallifi",
        name: "Kitob muallifi",
        table: "kitob_muallif",
    },
    { code_name: "kategoriya", name: "Kategoriya", table: "kategoriya" },
    { code_name: "kafedra", name: "Kafedra", table: "kafedra" },
    {
        code_name: "kategoriya_kafedra_boglash",
        name: "Kategoriya kafedra bog'lash",
        table: "kategoriya_kafedra",
    },
    { code_name: "kitob_tili", name: "Kitob tili", table: "kitob_tili" },
    {
        code_name: "kitob_alifbosi",
        name: "Kitob alifbosi",
        table: "kitob_alifbo",
    },
    { code_name: "kitob_holati", name: "Kitob holati", table: "kitob_status" },
    {
        code_name: "kitob_detallarini_boglash",
        name: "Kitob detallarini bog'lash",
        table: "kitob_detal",
    },
    {
        code_name: "kitob_qoshish",
        name: "Kitob qo'shish",
        table: "kitob_qoshish",
    },
    { code_name: "kitob_korish", name: "Kitob ko'rish", table: "kitob_korish" },
    { code_name: "yonalish", name: "Yo'nalish", table: "yonalish" },
    { code_name: "guruhlar", name: "Guruhlar", table: "guruhlar" },
    {
        code_name: "rektor_huquqlari",
        name: "Rektor huquqlari",
        table: "direktor",
    },
    {
        code_name: "qora_royxatni_korish",
        name: "Qora ro'yxatni ko'rish",
        table: "qora_list",
    },
    {
        code_name: "dekanat_huquqlari",
        name: "Dekanat huquqlari",
        table: "dekanat",
    },
];
const createDefaultPermissions = async () => {
    const count = await models_1.Permission.count();
    if (count > 0) {
        console.log(`ℹ️ Permissions jadvalida allaqachon ${count} ta yozuv mavjud. Yangi defaultlar qo‘shilmadi.`);
        return;
    }
    // Transaction bilan bulk yaratish
    await models_1.Permission.sequelize.transaction(async (transaction) => {
        await models_1.Permission.bulkCreate(exports.defaultPermissions, {
            validate: true,
            transaction,
        });
    });
    console.log(`✅ ${exports.defaultPermissions.length} ta default permission muvaffaqiyatli yaratildi.`);
};
exports.createDefaultPermissions = createDefaultPermissions;
