"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const db_1 = require("./config/db");
const expireOrders_1 = require("./cron/expireOrders");
require("./cron/orderOverdueChecker");
require("./cron/autoCategoryMigration");
const startOverdueOrderChecker_1 = require("./cron/startOverdueOrderChecker");
const reminderCron_1 = require("./cron/reminderCron");
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Middlewarelar
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
// Routers
app.use((req, res, next) => {
    req.models = db_1.sequelize.models;
    next();
});
app.use("/api", routes_1.default);
// Test route
app.get("/", (_, res) => {
    res.send("USAT Kutubxona backend ishlayapti 🚀");
});
(0, expireOrders_1.startExpireOrdersCron)();
(0, startOverdueOrderChecker_1.startOverdueOrderChecker)();
(0, reminderCron_1.reminderCron)();
// ❗ Error handler HAR DOIM oxirida bo'lishi kerak
app.use(errorHandler_1.default);
exports.default = app;
