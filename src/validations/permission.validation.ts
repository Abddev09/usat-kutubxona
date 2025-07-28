import { z } from "zod";

export const createPermissionSchema = {
  body: z.object({
    name: z.string().min(3, "Ism 3 ta hafirdan ko'p bo'lishi kerak"),
  }),
};
