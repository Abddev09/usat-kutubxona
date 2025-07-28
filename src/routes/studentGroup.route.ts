import { Router } from "express";
const router = Router();

import {
  getAllStudentGroups,
  getStudentGroup,
  createStudentGroup,
  updateStudentGroup,
  deleteStudentGroup,
} from "../controllers/studentGroup.controller";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createStudentGroupSchema,
  updateStudentGroupSchema,
} from "../validations/studentGroup.validation";
import { isAuthenticated } from "../middlewares/authorize";
import { checkDynamicPermission } from "../middlewares/checkPermission";
router.get("/", getAllStudentGroups);
router.get("/:id", getStudentGroup);
router.post(
  "/",
  isAuthenticated,

  validateRequest(createStudentGroupSchema),
  createStudentGroup
);
router.put(
  "/:id",
  isAuthenticated,
  validateRequest(updateStudentGroupSchema),
  updateStudentGroup
);
router.delete(
  "/:id",
  isAuthenticated,

  deleteStudentGroup
);
export default router;
