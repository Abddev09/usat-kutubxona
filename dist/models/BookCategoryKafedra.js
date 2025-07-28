"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookCategoryKafedra = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.BookCategoryKafedra = db_1.sequelize.define("BookCategoryKafedra", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    book_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    category_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    kafedra_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: "book_category_kafedras",
    timestamps: true,
});
