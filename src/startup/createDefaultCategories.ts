// src/startup/createDefaultCategories.ts
import { Category } from "../models";

export const createDefaultCategories = async () => {
  const defaults = [
    {
      code: "NEW_BOOKS",
      name_uz: "Yangi adabiyotlar",
      name_ru: "Новые литературы",
    },
    {
      code: "FICTION",
      name_uz: "Badiiy adabiyotlar",
      name_ru: "Художественная литература",
    },
    {
      code: "TEXTBOOKS",
      name_uz: "Darsliklar",
      name_ru: "Учебники",
    },
    {
      code: "MANUALS",
      name_uz: "O‘quv qo‘llanmalar",
      name_ru: "Учебные пособия",
    },
  ];

  const createdNames: string[] = [];

  for (const category of defaults) {
    const [created, isNew] = await Category.findOrCreate({
      where: { code: category.code },
      defaults: {
        name_uz: category.name_uz,
        name_ru: category.name_ru,
      },
    });

    if (isNew) {
      createdNames.push(category.name_uz);
    }
  }

  if (createdNames.length > 0) {
    console.log(
      `✅ Quyidagi kategoriyalar yaratildi: ${createdNames.join(", ")}`
    );
  }
};
