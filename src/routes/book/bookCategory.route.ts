import { Router } from "express";
const router = Router();
import {
  getAllBookCategories,
  getBookCategory,
  createBookCategory,
  updateBookCategory,
  deleteBookCategory,
} from "../../controllers/book/bookCategory.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookCategorySchema,
  updateBookCategorySchema,
} from "../../validations/bookCategory.validation";
import { isAuthenticated } from "../../middlewares/authorize";
import { checkDynamicPermission } from "../../middlewares/checkPermission";
router.get("/", getAllBookCategories);
router.get("/:id", getBookCategory);
router.post(
  "/",
  isAuthenticated,
  validateRequest(createBookCategorySchema),
  createBookCategory
);
router.put(
  "/:id",
  isAuthenticated,
  validateRequest(updateBookCategorySchema),
  updateBookCategory
);
router.delete("/:id", isAuthenticated, deleteBookCategory);
export default router;
