import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const UserGroup = sequelize.define(
  "UserGroup",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "user_groups",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "group_id"],
      },
    ],
  }
);
