import { Router } from "express";
const router = Router();
import {
  getTelegramUser,
  updateTelegramStep,
} from "../../logic/telegram.checking";
import { getAllKafedras } from "../../controllers/kafedra.controller";
import { getAllYonalish } from "../../controllers/yonalish.controller";
import {
  createUserOrder,
  getAllUserOrders,
} from "../../controllers/userOrder.controller";
import {
  createStudentGroup,
  getAllStudentGroups,
} from "../../controllers/studentGroup.controller";
import { getAllBookCategories } from "../../controllers/book/bookCategory.controller";
import { getAllAuthers } from "../../controllers/book/auther.controller";
import { getAllBooks } from "../../controllers/book/book.controller";
import { getAllCategories } from "../../controllers/book/category.controller";
import {
  getBooksByCategoryAndKafedra,
  getCategoryKafedralar,
} from "../../controllers/BookCategoryKafedra.controller";

router.get("/checking/:id", getTelegramUser);
router.patch("/:id", updateTelegramStep);
router.get("/kafedra", getAllKafedras);
router.get("/yonalish", getAllYonalish);
router.get("/student-groups", getAllStudentGroups);
router.get("/book-category", getAllBookCategories);
router.get("/authers", getAllAuthers);
router.get("/books", getAllBooks);
router.post("/user-order", createUserOrder);
router.get("/alluser-order", getAllUserOrders);
router.get("/categories", getAllCategories);
router.post("/student-groups", createStudentGroup);
router.get("/:id/kafedralar", getCategoryKafedralar);
router.get(
  "/:categoryId/kafedralar/:kafedraId/books",
  getBooksByCategoryAndKafedra
);

export default router;
