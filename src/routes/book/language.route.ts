import { Router } from "express";
const router = Router();

import {
  getLanguage,
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} from "../../controllers/book/language.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createLanguageSchema,
  updateLanguageSchema,
} from "../../validations/language.validation";
import { isAuthenticated } from "../../middlewares/authorize";
import { checkDynamicPermission } from "../../middlewares/checkPermission";
router.post(
  "/",
  isAuthenticated,
  validateRequest(createLanguageSchema),
  createLanguage
);
router.get("/", getAllLanguages);
router.get("/:id", getLanguage);
router.put(
  "/:id",
  isAuthenticated,
  validateRequest(updateLanguageSchema),
  updateLanguage
);
router.delete("/:id", deleteLanguage);
export default router;
