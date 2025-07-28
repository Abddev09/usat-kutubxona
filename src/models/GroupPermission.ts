import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const GroupPermission = sequelize.define(
  "GroupPermission",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "group_permissions",
  }
);
