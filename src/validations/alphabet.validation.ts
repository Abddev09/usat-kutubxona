// validations/alphabet.validation.ts
import { z } from "zod";

export const createAlphabetSchema = {
  body: z.object({
    name: z.string().min(1, "Name bo‘sh bo‘lmasligi kerak"),
  }),
};

export const updateAlphabetSchema = {
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID raqam bo‘lishi kerak"),
  }),
  body: z.object({
    name: z.string().min(1),
  }),
};
