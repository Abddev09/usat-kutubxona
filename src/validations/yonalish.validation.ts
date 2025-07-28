import { z } from "zod";

export const createYonalishSchema = {
  body: z.object({
    name_uz: z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
    name_ru: z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
  }),
};

export const updateYonalishSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    name_uz: z.string().min(2, "Yo'nalish nomi kamida 2 harf bo‘lishi kerak"),
    name_ru: z.string().min(2, "Название должно содержать не менее 2 букв"),
  }),
};
