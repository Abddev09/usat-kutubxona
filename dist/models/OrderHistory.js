"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderHistory = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.OrderHistory = db_1.sequelize.define("OrderHistory", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_order_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "user_orders",
            key: "id",
        },
    },
    action: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false, // Misollar: 'REJECTED', 'RETURNED', 'EXTENDED', 'GIVEN'
    },
    performed_by: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false, // Admin user_id
        references: {
            model: "users",
            key: "id",
        },
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: "order_histories",
    timestamps: false,
});
