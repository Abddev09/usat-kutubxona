import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Status = sequelize.define(
  "Status",
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
  },
  {
    tableName: "statuses",
    timestamps: true,
  }
);
