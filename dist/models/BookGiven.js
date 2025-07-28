"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookGiven = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.BookGiven = db_1.sequelize.define("BookGiven", {
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
    admin_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    given_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: "book_given",
});
