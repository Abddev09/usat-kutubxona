import cron from "node-cron";
import { Op } from "sequelize";
import { BookCategoryKafedra } from "../models/BookCategoryKafedra";
import { Category } from "../models/book/Category";

let cronIsRunning = false;

cron.schedule("0 0 1 1,7 *", async () => {
  if (cronIsRunning) {
    console.warn("[CRON] Oldingi ish hali tugamagan, yangi ish boshlanmadi.");
    return;
  }
  cronIsRunning = true;

  try {
    const oneMinuteAgo = new Date(Date.now() - 60_000);

    console.log(
      `[CRON] BookCategoryKafedra bo‘yicha tekshirish boshlandi (${new Date().toISOString()})`
    );

    // 1️⃣ Kategoriyalarni topish
    const categories = await Category.findAll({
      where: {
        code: { [Op.in]: ["NEW_BOOKS", "FICTION"] },
      },
    });

    const newBooksCategory = categories.find(
      (c) => c.get("code") === "NEW_BOOKS"
    );
    const fictionCategory = categories.find((c) => c.get("code") === "FICTION");

    if (!newBooksCategory || !fictionCategory) {
      console.warn("[CRON] Kategoriyalar topilmadi.");
      return;
    }

    const newBooksCategoryId = newBooksCategory.get("id");
    const fictionCategoryId = fictionCategory.get("id");

    // 2️⃣ NEW_BOOKS dagi barcha yozuvlar (BookCategoryKafedra)
    const records = await BookCategoryKafedra.findAll({
      where: {
        category_id: newBooksCategoryId,
        createdAt: { [Op.lt]: oneMinuteAgo },
      },
    });

    if (records.length === 0) {
      console.log("[CRON] Yangi kitoblar topilmadi.");
      return;
    }

    console.log(`[CRON] Topilgan yozuvlar soni: ${records.length}`);

    // 3️⃣ Har birini FICTION ga ko‘chirish
    for (const record of records) {
      const bookId = record.get("book_id");
      const kafedraId = record.get("kafedra_id");

      // Shu kitob FICTION kategoriyada bor-yo‘qligini tekshirish
      const exists = await BookCategoryKafedra.findOne({
        where: {
          book_id: bookId,
          kafedra_id: kafedraId,
          category_id: fictionCategoryId,
        },
      });

      if (!exists) {
        // FICTION ga qo‘shish
        await BookCategoryKafedra.create({
          book_id: bookId,
          kafedra_id: kafedraId,
          category_id: fictionCategoryId,
        });
        console.log(
          `[CRON] Kitob #${bookId} (Kafedra #${kafedraId}) Badiiy adabiyotlarga qo‘shildi.`
        );
      } else {
        console.log(
          `[CRON] Kitob #${bookId} (Kafedra #${kafedraId}) allaqachon Badiiy adabiyotlarda mavjud.`
        );
      }

      // NEW_BOOKS dan o‘chirish
      await record.destroy();
      console.log(
        `[CRON] Kitob #${bookId} (Kafedra #${kafedraId}) Yangi adabiyotlardan o‘chirildi.`
      );
    }

    console.log("[CRON] Tekshiruv tugadi.");
  } catch (error) {
    console.error("[CRON ERROR]", error);
  } finally {
    cronIsRunning = false;
  }
});
