import { z } from "zod";

export const createAutherSchema = {
  body: z.object({
    name: z.string().min(2, "Ism kamida 2 harf bo‘lishi kerak"),
  }),
};

export const updateAutherSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({ name: z.string().min(2) }),
};
