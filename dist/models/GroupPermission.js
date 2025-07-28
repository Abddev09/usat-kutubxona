"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPermission = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.GroupPermission = db_1.sequelize.define("GroupPermission", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    group_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    permission_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: "group_permissions",
});
