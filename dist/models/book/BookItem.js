"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookItem = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
exports.BookItem = db_1.sequelize.define("BookItem", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    book_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    language_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    alphabet_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    status_id: {
        type: sequelize_1.DataTypes.SMALLINT,
        allowNull: true,
    },
    pdf_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "pdf_files",
            key: "id",
        },
    },
}, {
    tableName: "book_items",
    timestamps: true,
});
