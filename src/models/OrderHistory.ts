import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

export const OrderHistory = sequelize.define(
  "OrderHistory",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "user_orders",
        key: "id",
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false, // Misollar: 'REJECTED', 'RETURNED', 'EXTENDED', 'GIVEN'
    },
    performed_by: {
      type: DataTypes.BIGINT,
      allowNull: false, // Admin user_id
      references: {
        model: "users",
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "order_histories",
    timestamps: false,
  }
);
