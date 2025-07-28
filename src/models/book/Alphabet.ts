import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const Alphabet = sequelize.define(
  "Alphabet",
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
    tableName: "alphabets",
    timestamps: true,
  }
);
