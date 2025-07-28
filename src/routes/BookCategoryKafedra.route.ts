import { Router } from "express";
import {
  getAllBookCategoryKafedras,
  getBookCategoryKafedra,
  createBookCategoryKafedra,
  updateBookCategoryKafedra,
  deleteBookCategoryKafedra,
  getBooksByCategoryAndKafedra,
  getCategoryKafedralar,
} from "../controllers/BookCategoryKafedra.controller";

const router = Router();

router.get("/", getAllBookCategoryKafedras);
router.get("/:id", getBookCategoryKafedra);
router.post("/", createBookCategoryKafedra);
router.put("/:id", updateBookCategoryKafedra);
router.delete("/:id", deleteBookCategoryKafedra);
router.get("/:id/kafedralar", getCategoryKafedralar);
router.get(
  "/:categoryId/kafedralar/:kafedraId/books",
  getBooksByCategoryAndKafedra
);

export default router;
