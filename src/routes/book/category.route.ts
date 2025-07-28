import { Router } from "express";
const router = Router();
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getBooksByCategoryAndKafedra,
} from "../../controllers/book/category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../validations/category.validation";
import { isAuthenticated } from "../../middlewares/authorize";
import { checkDynamicPermission } from "../../middlewares/checkPermission";
router.get("/", getAllCategories);
router.get("/:id", getCategory);
router.post(
  "/",
  // isAuthenticated,
  validateRequest(createCategorySchema),
  createCategory
);
router.put(
  "/:id",
  isAuthenticated,
  validateRequest(updateCategorySchema),
  updateCategory
);
router.delete("/:id", isAuthenticated, deleteCategory);
router.get("/:id/books", getBooksByCategoryAndKafedra);
export default router;
