import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Yonalish = sequelize.define(
  "Yonalish",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name_uz: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_ru: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "yonalishs",
    timestamps: true,
  }
);
