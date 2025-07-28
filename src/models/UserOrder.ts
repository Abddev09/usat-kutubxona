import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const UserOrder = sequelize.define(
  "UserOrder",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    book_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
    book_code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    taking_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_orders",
    timestamps: false,
  }
);
