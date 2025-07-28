import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Kafedra = sequelize.define(
  "Kafedra",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name_uz: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name_ru: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "kafedras",
    timestamps: true,
  }
);
