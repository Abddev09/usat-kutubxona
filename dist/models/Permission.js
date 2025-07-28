"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.Permission = db_1.sequelize.define("Permission", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    code_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    table: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "permissions",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["code_name"],
        },
    ],
});
