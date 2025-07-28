import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const BookItem = sequelize.define(
  "BookItem",
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
    language_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    alphabet_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    pdf_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "pdf_files",
        key: "id",
      },
    },
  },
  {
    tableName: "book_items",
    timestamps: true,
  }
);
