"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentGroup = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.StudentGroup = db_1.sequelize.define("StudentGroup", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    yonalish_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: "student_groups",
    timestamps: true,
});
