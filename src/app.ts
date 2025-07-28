// src/app.ts
import express from "express";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";
import morgan from "morgan";
import router from "./routes";
import { sequelize } from "./config/db";
import { startExpireOrdersCron } from "./cron/expireOrders";
import "./cron/orderOverdueChecker";
import "./cron/autoCategoryMigration";
import { startOverdueOrderChecker } from "./cron/startOverdueOrderChecker";
import { reminderCron } from "./cron/reminderCron";
import compression from "compression";
import path from "path";

const app = express();

// Middlewarelar
app.use(compression());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
// Routers
app.use((req, res, next) => {
  req.models = sequelize.models;
  next();
});
app.use("/api", router);
// Test route
app.get("/", (_, res) => {
  res.send("USAT Kutubxona backend ishlayapti 🚀");
});
startExpireOrdersCron();
startOverdueOrderChecker();
reminderCron();
// ❗ Error handler HAR DOIM oxirida bo'lishi kerak
app.use(errorHandler);
export default app;
