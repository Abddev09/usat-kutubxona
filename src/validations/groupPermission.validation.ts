import { z } from "zod";

export const createGroupPermissionSchema = {
  body: z.object({
    group_id: z.number().int(),
    permission_id: z.number().int(),
  }),
};
