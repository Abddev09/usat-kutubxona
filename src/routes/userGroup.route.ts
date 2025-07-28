import { Router } from "express";
const router = Router();

import {
  getAllUserGroups,
  getUserGroup,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
} from "../controllers/userGroup.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createUserGroupSchema } from "../validations/userGroup.valudation";
router.get("/", getAllUserGroups);
router.get("/:id", getUserGroup);
router.post("/", validateRequest(createUserGroupSchema), createUserGroup);
router.put("/:id", validateRequest(createUserGroupSchema), updateUserGroup);
router.delete("/:id", deleteUserGroup);
export default router;
