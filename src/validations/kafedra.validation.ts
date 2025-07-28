import { z } from "zod";

export const createKafedraSchema = {
  body: z.object({
    name_uz: z.string().min(2, "Kafedra nomi kamida 2 harf bo‘lishi kerak"),
    name_ru: z.string().min(2, "Кафедра номи камида 2 ҳарф бўлиши керак"),
  }),
};

export const updateKafedraSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    name_uz: z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
    name_ru: z
      .string()
      .min(2, "Название кафедры должно содержать не менее 2 букв"),
  }),
};
