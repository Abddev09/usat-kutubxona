"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrder = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.UserOrder = db_1.sequelize.define("UserOrder", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    book_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: "books",
            key: "id",
        },
    },
    book_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    status_id: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    finished_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    taking_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "user_orders",
    timestamps: false,
});
