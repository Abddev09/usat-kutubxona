import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const BookCategoryKafedra = sequelize.define(
  "BookCategoryKafedra",
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
    kafedra_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "book_category_kafedras",
    timestamps: true,
  }
);
