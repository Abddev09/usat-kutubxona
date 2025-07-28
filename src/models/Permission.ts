import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Permission = sequelize.define(
  "Permission",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    code_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    table: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "permissions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["code_name"],
      },
    ],
  }
);
