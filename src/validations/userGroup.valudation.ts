import { z } from "zod";

export const createUserGroupSchema = {
  body: z.object({
    user_id: z.number(),
    group_id: z.number(),
  }),
};
