"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
exports.Book = db_1.sequelize.define("Book", {
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    author_id: { type: sequelize_1.DataTypes.BIGINT, allowNull: true },
    year: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    page: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    books: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    book_count: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    image_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: "image_files",
            key: "id",
        },
    },
}, {
    tableName: "books",
    timestamps: true,
});
