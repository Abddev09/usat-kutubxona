import { z } from "zod";

export const createCategorySchema = {
  body: z.object({
    name_uz: z.string().min(2, "Kategoriya nomi kamida 2 harf bo‘lishi kerak"),
    name_ru: z.string().min(2, "Kategoriya nomi kamida 2 harf bo‘lishi kerak"),
  }),
};

export const updateCategorySchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({ name_uz: z.string().min(2), name_ru: z.string().min(2) }),
};
