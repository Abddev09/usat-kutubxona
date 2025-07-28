import { Router } from "express";
import {
  getAllBookItems,
  getBookItem,
  createBookItem,
  updateBookItem,
  deleteBookItem,
} from "../../controllers/book/bookItem.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookItemSchema,
  updateBookItemSchema,
} from "../../validations/bookItem.validation";

const router = Router();

router.get("/", getAllBookItems);
router.get("/:id", getBookItem);
router.post("/",  createBookItem);
router.put("/:id", validateRequest(updateBookItemSchema), updateBookItem);
router.delete("/:id", deleteBookItem);
export default router;
