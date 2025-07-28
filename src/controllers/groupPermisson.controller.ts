import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { GroupPermission } from "../models/GroupPermission";
import { sendSuccess } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";
import { Group } from "../models/Group";
import { Permission } from "../models/Permission";
import { sequelize } from "../config/db";
import { GroupPermissionInstance } from "../types/models";
// @router GET /api/group-permissions
// @desc Barcha Group Permissions
// @access Public
export const getAllGroupPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const groupPermissions = await GroupPermission.findAll({
      include: [
        {
          model: Group,
          attributes: ["id", "name"],
          as: "groupInfo", // faqat keraklilar
        },
        {
          model: Permission,
          attributes: ["id", "name", "code_name", "table"],
          as: "permissionInfo", // yoki `title` bo‘lsa o‘shani yoz
        },
      ],
    });
    return sendSuccess(res, {
      message: "Barcha Group Permissions",
      data: groupPermissions,
      statusCode: 200,
    });
  }
);
// @router GET /api/group-permissions/:id
// @desc Group Permissini topish
// @access Public
export const getGroupPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const groupPermission = await GroupPermission.findByPk(id);
    if (!groupPermission) {
      throw new ApiError(404, "Ruxsat topilmadi");
    }
    return sendSuccess(res, {
      message: "Ruxsat topildi",
      data: groupPermission,
      statusCode: 200,
    });
  }
);

// @router DELETE /api/group-permissions/:id
// @desc Group Permission o'chirish
// @access Public
export const deleteGroupPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const groupPermission = await GroupPermission.findByPk(id);
    if (!groupPermission) {
      throw new ApiError(404, "Ruxsat topilmadi");
    }
    await groupPermission.destroy();
    return sendSuccess(res, {
      message: "Ruxsat muvaffaqiyatli o‘chirildi",
      data: groupPermission,
      statusCode: 200,
    });
  }
);

// @router PUT /api/group-permissions/:id
// @desc Group Permission o'zgartirish
// @access Public
export const updateGroupPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { group, permission } = req.body;
    const groupPermission = await GroupPermission.findByPk(id);
    if (!groupPermission) {
      throw new ApiError(404, "Ruxsat topilmadi");
    }
    await groupPermission.update({
      group,
      permission,
    });
    return sendSuccess(res, {
      message: "Ruxsat muvaffaqiyatli o‘zgartirildi",
      data: groupPermission,
      statusCode: 200,
    });
  }
);

// @router POST /api/group-permissions
// @desc Group Permission yaratish
// @access Public
export const createGroupPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const { group_id, permission_id } = req.body;

    if (!group_id || !permission_id) {
      throw new ApiError(400, "group_id va permission_id majburiy");
    }

    // Ixtiyoriy: Takroriy bog‘lanish bor-yo‘qligini tekshir
    const exists = await GroupPermission.findOne({
      where: { group_id, permission_id },
    });
    if (exists) {
      throw new ApiError(
        409,
        "Bu permission allaqachon bu groupga biriktirilgan"
      );
    }

    const newGP = await GroupPermission.create({ group_id, permission_id });

    return sendSuccess(res, {
      message: "Permission groupga biriktirildi",
      data: newGP,
    });
  }
);

// @router POST /api/group-permissions
// 2desc Admin Group Permissonlarni belgilaydi
// @access Private
export const assignPermissionsToGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const { group_id, permission_ids } = req.body;

    if (!Array.isArray(permission_ids) || !group_id) {
      throw new ApiError(400, "Noto‘g‘ri ma’lumot");
    }

    const t = await sequelize.transaction();

    try {
      // 1. Bazadagi mavjud permissionlarni topamiz
      const existing = (await GroupPermission.findAll({
        where: { group_id },
        attributes: ["permission_id"],
        transaction: t,
      })) as GroupPermissionInstance[];

      const existingIds = existing.map((item) => item.permission_id);
      const isSame =
        existingIds.length === permission_ids.length &&
        existingIds.every((id) => permission_ids.includes(id));

      if (isSame) {
        await t.rollback();
        return sendSuccess(res, {
          message: "Permissionlar allaqachon yangilangan",
        });
      }

      // 2. Eski huquqlarni tozalaymiz
      await GroupPermission.destroy({ where: { group_id }, transaction: t });

      // 3. Yangi huquqlarni kiritamiz
      const newPermissions = permission_ids.map((permission_id: number) => ({
        group_id,
        permission_id,
      }));

      await GroupPermission.bulkCreate(newPermissions, { transaction: t });

      await t.commit();

      return sendSuccess(res, {
        message: "Permissionlar muvaffaqiyatli yangilandi",
      });
    } catch (error) {
      await t.rollback();
      throw new ApiError(500, "Permissionlarni yangilashda xatolik");
    }
  }
);
