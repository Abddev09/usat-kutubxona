"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
exports.Category = db_1.sequelize.define("Category", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name_uz: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    name_ru: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
}, {
    tableName: "categories",
    timestamps: true,
});
