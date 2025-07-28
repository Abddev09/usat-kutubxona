"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGroup = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.UserGroup = db_1.sequelize.define("UserGroup", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    group_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: "user_groups",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["user_id", "group_id"],
        },
    ],
});
