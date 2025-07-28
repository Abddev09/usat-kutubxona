import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const Auther = sequelize.define(
  "Auther",
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
    tableName: "authers",
    timestamps: true,
  }
);
