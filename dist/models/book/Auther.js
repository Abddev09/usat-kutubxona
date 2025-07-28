"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auther = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
exports.Auther = db_1.sequelize.define("Auther", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "authers",
    timestamps: true,
});
