import { z } from "zod";

export const createBookCategorySchema = {
  body: z.object({
    book_id: z.number(),
    category_id: z.number(),
  }),
};

export const updateBookCategorySchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    book_id: z.number(),
    category_id: z.number(),
  }),
};
