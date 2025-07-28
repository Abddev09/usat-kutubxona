import { z } from "zod";

export const createGroupSchema = {
  body: z.object({
    name: z.string().min(3, "Group nomi 3 ta hafirdan ko'p bo'lishi kerak"),
    can_login: z.boolean({ required_error: "can_login bo'lishi kerak" }),
  }),
};
