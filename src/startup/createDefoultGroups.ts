import { Group } from "../models";

const defaultGroups = [
  { name: "Admin", can_login: true },
  { name: "Kutubxona xodimi", can_login: true },
  { name: "Student", can_login: false },
  { name: "Dekanat", can_login: true },
  { name: "Rektorat", can_login: true },
  { name: "O'qituvchi", can_login: true },
];

export const createDefaultGroups = async () => {
  const createdGroups: string[] = [];

  // Barcha tekshiruvlarni parallel qilib yuboramiz
  await Promise.all(
    defaultGroups.map(async (group) => {
      const exists = await Group.findOne({
        where: { name: group.name },
      });

      if (!exists) {
        await Group.create({
          name: group.name,
          can_login: group.can_login,
        });
        createdGroups.push(group.name);
      }
    })
  );

  // Yakuniy natijani chiqarish
  if (createdGroups.length > 0) {
    console.log(`✅ Quyidagi guruhlar yaratildi: ${createdGroups.join(", ")}`);
  } else {
    console.log(`ℹ️ Barcha guruhlar oldin yaratilgan, yangisi qo'shilmadi.`);
  }
};
