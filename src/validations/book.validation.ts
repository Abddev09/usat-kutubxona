import { z } from "zod";

export const createBookSchema = {
  body: z.object({
    name: z
      .string()
      .min(2, "Kitob nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),

    author_id: z.coerce.number().optional().nullable(), // string => number

    year: z.coerce.number().int().min(1, "Yil to‘g‘ri raqam bo‘lishi kerak"),

    page: z.coerce
      .number()
      .int()
      .min(1, "Sahifalar soni to‘g‘ri raqam bo‘lishi kerak"),

    book_count: z.coerce
      .number()
      .int()
      .min(1, "Kitob soni to‘g‘ri raqam bo‘lishi kerak"),

    description: z.string().optional(),
  }),
};

export const updateBookSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),

  body: z.object({
    name: z
      .string()
      .min(2, "Kitob nomi kamida 2 ta belgidan iborat bo‘lishi kerak"),

    author_id: z.coerce.number().optional().nullable(),

    year: z.coerce.number().int().min(1, "Yil to‘g‘ri raqam bo‘lishi kerak"),

    page: z.coerce
      .number()
      .int()
      .min(1, "Sahifalar soni to‘g‘ri raqam bo‘lishi kerak"),

    book_count: z.coerce
      .number()
      .int()
      .min(1, "Kitob soni to‘g‘ri raqam bo‘lishi kerak"),

    description: z.string().optional(),
  }),
};
