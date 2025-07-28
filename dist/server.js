"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // .env o‘qiladi
const models_1 = require("./models");
const createDefaultCategories_1 = require("./startup/createDefaultCategories");
const createDefoultGroups_1 = require("./startup/createDefoultGroups");
const createDefoultPermissons_1 = require("./startup/createDefoultPermissons");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await db_1.sequelize.authenticate();
        console.log("✅ PostgreSQL bilan ulanish muvaffaqiyatli");
        (0, models_1.initModels)();
        await db_1.sequelize.sync(); // Model o'zgarishlarini bazaga qo'llash
        await (0, createDefaultCategories_1.createDefaultCategories)();
        await (0, createDefoultGroups_1.createDefaultGroups)();
        await (0, createDefoultPermissons_1.createDefaultPermissions)();
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server ${PORT} portda ishga tushdi`);
        });
    }
    catch (err) {
        console.error("❌ Ulanishda xatolik:", err);
        process.exit(1);
    }
};
startServer();
