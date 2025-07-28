import { Router } from "express";

import {
  getAllYonalish,
  getYonalish,
  createYonalish,
  updateYonalish,
  deleteYonalish,
} from "../controllers/yonalish.controller";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createYonalishSchema,
  updateYonalishSchema,
} from "../validations/yonalish.validation";
import { isAuthenticated } from "../middlewares/authorize";
import { checkDynamicPermission } from "../middlewares/checkPermission";
const router = Router();
router.get("/", getAllYonalish);
router.get("/:id", getYonalish);
router.post(
  "/",
  isAuthenticated,
  validateRequest(createYonalishSchema),
  createYonalish
);
router.put(
  "/:id",
  isAuthenticated,
  validateRequest(updateYonalishSchema),
  updateYonalish
);
router.delete(
  "/:id",
  isAuthenticated,
  deleteYonalish
);
export default router;
