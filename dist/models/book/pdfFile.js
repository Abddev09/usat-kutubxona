"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFFile = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
exports.PDFFile = db_1.sequelize.define("PDFFile", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    file_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    file_size: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    original_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "pdf_files",
    timestamps: true,
});
