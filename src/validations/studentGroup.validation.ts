import { z } from "zod";

export const createStudentGroupSchema = {
  body: z.object({
    name: z
      .string()
      .min(2, "Student group nomi 3 ta hafirdan ko'p bo'lishi kerak"),
    yonalish_id: z.number(),
  }),
};

export const updateStudentGroupSchema = {
  params: z.object({ id: z.string().regex(/^\d+$/) }),
  body: z.object({
    name: z
      .string()
      .min(3, "Student group nomi 3 ta hafirdan ko'p bo'lishi kerak"),
    yonalish_id: z.number(),
  }),
};
