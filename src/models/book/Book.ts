import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const Book = sequelize.define(
  "Book",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    author_id: { type: DataTypes.BIGINT, allowNull: true },
    year: { type: DataTypes.INTEGER, allowNull: false },
    page: { type: DataTypes.INTEGER, allowNull: false },
    books: { type: DataTypes.INTEGER, allowNull: true },
    book_count: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    image_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "image_files",
        key: "id",
      },
    },
  },
  {
    tableName: "books",
    timestamps: true,
  }
);
