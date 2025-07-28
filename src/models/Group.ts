import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Group = sequelize.define(
  "Group",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    can_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "groups",
    timestamps: true,
  }
);
