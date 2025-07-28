"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
exports.Language = db_1.sequelize.define("Language", {
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
    tableName: "languages",
    timestamps: true,
});
