import { Router } from "express";
import {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createGroupSchema } from "../validations/groups.validation";
const router = Router();
router.get("/", getAllGroups);
router.get("/:id", getGroup);
router.post("/", validateRequest(createGroupSchema), createGroup);
router.put("/:id", validateRequest(createGroupSchema), updateGroup);
router.delete("/:id", deleteGroup);

export default router;
