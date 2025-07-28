import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const Language = sequelize.define(
  "Language",
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
    tableName: "languages",
    timestamps: true,
  }
);
