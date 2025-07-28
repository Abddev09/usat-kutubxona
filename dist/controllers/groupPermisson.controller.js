"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignPermissionsToGroup = exports.createGroupPermission = exports.updateGroupPermission = exports.deleteGroupPermission = exports.getGroupPermission = exports.getAllGroupPermissions = void 0;
const asyncHandler_1 = require("../middlewares/asyncHandler");
const GroupPermission_1 = require("../models/GroupPermission");
const responseHandler_1 = require("../utils/responseHandler");
const ApiError_1 = require("../utils/ApiError");
const Group_1 = require("../models/Group");
const Permission_1 = require("../models/Permission");
const db_1 = require("../config/db");
// @router GET /api/group-permissions
// @desc Barcha Group Permissions
// @access Public
exports.getAllGroupPermissions = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const groupPermissions = await GroupPermission_1.GroupPermission.findAll({
        include: [
            {
                model: Group_1.Group,
                attributes: ["id", "name"],
                as: "groupInfo", // faqat keraklilar
            },
            {
                model: Permission_1.Permission,
                attributes: ["id", "name", "code_name", "table"],
                as: "permissionInfo", // yoki `title` bo‘lsa o‘shani yoz
            },
        ],
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Barcha Group Permissions",
        data: groupPermissions,
        statusCode: 200,
    });
});
// @router GET /api/group-permissions/:id
// @desc Group Permissini topish
// @access Public
exports.getGroupPermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const groupPermission = await GroupPermission_1.GroupPermission.findByPk(id);
    if (!groupPermission) {
        throw new ApiError_1.ApiError(404, "Ruxsat topilmadi");
    }
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Ruxsat topildi",
        data: groupPermission,
        statusCode: 200,
    });
});
// @router DELETE /api/group-permissions/:id
// @desc Group Permission o'chirish
// @access Public
exports.deleteGroupPermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const groupPermission = await GroupPermission_1.GroupPermission.findByPk(id);
    if (!groupPermission) {
        throw new ApiError_1.ApiError(404, "Ruxsat topilmadi");
    }
    await groupPermission.destroy();
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Ruxsat muvaffaqiyatli o‘chirildi",
        data: groupPermission,
        statusCode: 200,
    });
});
// @router PUT /api/group-permissions/:id
// @desc Group Permission o'zgartirish
// @access Public
exports.updateGroupPermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { group, permission } = req.body;
    const groupPermission = await GroupPermission_1.GroupPermission.findByPk(id);
    if (!groupPermission) {
        throw new ApiError_1.ApiError(404, "Ruxsat topilmadi");
    }
    await groupPermission.update({
        group,
        permission,
    });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Ruxsat muvaffaqiyatli o‘zgartirildi",
        data: groupPermission,
        statusCode: 200,
    });
});
// @router POST /api/group-permissions
// @desc Group Permission yaratish
// @access Public
exports.createGroupPermission = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { group_id, permission_id } = req.body;
    if (!group_id || !permission_id) {
        throw new ApiError_1.ApiError(400, "group_id va permission_id majburiy");
    }
    // Ixtiyoriy: Takroriy bog‘lanish bor-yo‘qligini tekshir
    const exists = await GroupPermission_1.GroupPermission.findOne({
        where: { group_id, permission_id },
    });
    if (exists) {
        throw new ApiError_1.ApiError(409, "Bu permission allaqachon bu groupga biriktirilgan");
    }
    const newGP = await GroupPermission_1.GroupPermission.create({ group_id, permission_id });
    return (0, responseHandler_1.sendSuccess)(res, {
        message: "Permission groupga biriktirildi",
        data: newGP,
    });
});
// @router POST /api/group-permissions
// 2desc Admin Group Permissonlarni belgilaydi
// @access Private
exports.assignPermissionsToGroup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { group_id, permission_ids } = req.body;
    if (!Array.isArray(permission_ids) || !group_id) {
        throw new ApiError_1.ApiError(400, "Noto‘g‘ri ma’lumot");
    }
    const t = await db_1.sequelize.transaction();
    try {
        // 1. Bazadagi mavjud permissionlarni topamiz
        const existing = (await GroupPermission_1.GroupPermission.findAll({
            where: { group_id },
            attributes: ["permission_id"],
            transaction: t,
        }));
        const existingIds = existing.map((item) => item.permission_id);
        const isSame = existingIds.length === permission_ids.length &&
            existingIds.every((id) => permission_ids.includes(id));
        if (isSame) {
            await t.rollback();
            return (0, responseHandler_1.sendSuccess)(res, {
                message: "Permissionlar allaqachon yangilangan",
            });
        }
        // 2. Eski huquqlarni tozalaymiz
        await GroupPermission_1.GroupPermission.destroy({ where: { group_id }, transaction: t });
        // 3. Yangi huquqlarni kiritamiz
        const newPermissions = permission_ids.map((permission_id) => ({
            group_id,
            permission_id,
        }));
        await GroupPermission_1.GroupPermission.bulkCreate(newPermissions, { transaction: t });
        await t.commit();
        return (0, responseHandler_1.sendSuccess)(res, {
            message: "Permissionlar muvaffaqiyatli yangilandi",
        });
    }
    catch (error) {
        await t.rollback();
        throw new ApiError_1.ApiError(500, "Permissionlarni yangilashda xatolik");
    }
});
