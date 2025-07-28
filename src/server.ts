// src/server.ts
import app from "./app";
import { sequelize } from "./config/db";
import dotenv from "dotenv";
dotenv.config(); // .env o‘qiladi
import { initModels } from "./models";
import { createDefaultCategories } from "./startup/createDefaultCategories";
import { createDefaultGroups } from "./startup/createDefoultGroups";
import { createDefaultPermissions } from "./startup/createDefoultPermissons";
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL bilan ulanish muvaffaqiyatli");
    initModels();
    await sequelize.sync(); // Model o'zgarishlarini bazaga qo'llash
    await createDefaultCategories();
    await createDefaultGroups();
    await createDefaultPermissions();

    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portda ishga tushdi`);
    });
  } catch (err) {
    console.error("❌ Ulanishda xatolik:", err);
    process.exit(1);
  }
};

startServer();
