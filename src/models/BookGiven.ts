import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const BookGiven = sequelize.define(
  "BookGiven",
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
    admin_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    given_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "book_given",
  }
);


