import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db";

export const PDFFile = sequelize.define(
  "PDFFile",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "pdf_files",
    timestamps: true,
  }
);
