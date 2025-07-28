import { z } from "zod";

export const createBookItemSchema = {
  body: z.object({
    book_id: z.number(),
    language_id: z.number(),
    alphabet_id: z.number(),
    status_id: z.number(),
  }),
};

export const updateBookItemSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    book_id: z.number(),
    language_id: z.number(),
    alphabet_id: z.number(),
    status_id: z.number(),
  }),
};
