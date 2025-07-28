import { z } from "zod";

export const createLanguageSchema = {
  body: z.object({
    name: z
      .string()
      .min(2, "Til nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),
  }),
};

export const updateLanguageSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    name: z
      .string()
      .min(2, "Til nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),
  }),
};
