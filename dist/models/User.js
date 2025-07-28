"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.User = db_1.sequelize.define("User", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    full_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    passport_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    // foreignKey to StudentGroup
    student_group_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    telegram_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
    step: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
    },
    language: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: "users",
    timestamps: true,
    paranoid: true,
});
