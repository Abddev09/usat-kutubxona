"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yonalish = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.Yonalish = db_1.sequelize.define("Yonalish", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name_uz: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name_ru: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "yonalishs",
    timestamps: true,
});
