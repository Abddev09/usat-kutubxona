import { Router } from "express";
import { getAllAuthers } from "../controllers/book/auther.controller";
import { getAllCategories } from "../controllers/book/category.controller";
import { getAllKafedras } from "../controllers/kafedra.controller";
import { getAllBookItems } from "../controllers/book/bookItem.controller";
import { siteLogin } from "../website/login.controller";
import { getAllBooks } from "../controllers/book/book.controller";
import {
  createUserOrder,
  getAllUserOrders,
  getUserOrdersByUserId,
} from "../controllers/userOrder.controller";
const router = Router();

router.get("/authers", getAllAuthers);
router.get("/categories", getAllCategories);
router.get("/kafedras", getAllKafedras);
router.get("/book-items", getAllBookItems);
router.post("/login", siteLogin);
router.get("/books", getAllBooks);
router.post("/user-order", createUserOrder);
router.get("/alluser-order", getAllUserOrders);
router.get("/user-order/:id", getUserOrdersByUserId);
router.get("/categories", getAllCategories);
// userOrder

export default router;
