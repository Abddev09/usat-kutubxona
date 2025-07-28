import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const BookCategory = sequelize.define(
  "BookCategory",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    book_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "book_categories",
    timestamps: true,
  }
);
