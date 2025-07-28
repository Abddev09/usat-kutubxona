import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { Permission } from "../models/Permission";
import { GroupPermission } from "../models/GroupPermission";
import { UserGroup } from "../models/UserGroup";
import { Op } from "sequelize";
import { PermissionInstance, UserGroupInstance } from "../types/models";

export const checkDynamicPermission = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissionCode = req.headers["x-permission"] as string;
      if (!permissionCode)
        throw new ApiError(400, "x-permission header topilmadi");

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new ApiError(401, "Token topilmadi");

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
      };

      // User qanday group(larga) tegishli?
      const userGroups = (await UserGroup.findAll({
        where: { user_id: decoded.id },
      })) as UserGroupInstance[];

      const groupIds = userGroups.map((ug) => ug.group_id);
      if (!groupIds.length)
        throw new ApiError(403, "Foydalanuvchiga group biriktirilmagan");

      // Permission mavjudmi?
      const permission = (await Permission.findOne({
        where: { code_name: permissionCode },
      })) as PermissionInstance;

      if (!permission)
        throw new ApiError(404, `Permission topilmadi: ${permissionCode}`);

      // Ushbu permissionga ega group bormi?
      const hasPermission = await GroupPermission.findOne({
        where: {
          permission_id: permission.id,
          group_id: { [Op.in]: groupIds },
        },
      });

      if (!hasPermission)
        throw new ApiError(403, `Ruxsat berilmagan: ${permissionCode}`);

      next();
    } catch (err) {
      console.error("❌ checkDynamicPermission error:", err);
      next(new ApiError(500, "Ichki server xatoligi"));
    }
  };
};
