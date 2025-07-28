import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { Language } from "./book/Language";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passport_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // foreignKey to StudentGroup
    student_group_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    telegram_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    step: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true,
  }
);
