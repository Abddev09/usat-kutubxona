"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.Group = db_1.sequelize.define("Group", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    can_login: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "groups",
    timestamps: true,
});
