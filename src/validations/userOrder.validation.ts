import { z } from "zod";

export const createUserOrderSchema = {
  body: z.object({
    user_id: z.number(),
    book_id: z.number(),
  }),
};

export const updateUserOrderSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    user_id: z.number(),
    book_id: z.number(),
  }),
};

export const extendUserOrderSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
};

export const confirmUserOrderSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    book_code: z.string().min(3, "Kitob kod 3 ta hafirdan ko'p bo'lishi kerak"),
  }),
};
