import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const StudentGroup = sequelize.define(
  "StudentGroup",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yonalish_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "student_groups",
    timestamps: true,
  }
);
