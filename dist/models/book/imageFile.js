"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFile = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
class ImageFile extends sequelize_1.Model {
}
exports.ImageFile = ImageFile;
ImageFile.init({
    id: { type: sequelize_1.DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    filename: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    path: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    url: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    mimetype: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    size: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
}, {
    sequelize: db_1.sequelize,
    tableName: "image_files",
    timestamps: true,
});
