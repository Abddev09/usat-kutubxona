import { Router } from "express";
import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../../controllers/book/book.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createBookSchema,
  updateBookSchema,
} from "../../validations/book.validation";
import { uploadImages } from "../../middlewares/uploadImages";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBook);

router.post(
  "/",
  uploadImages.single("image"),
  validateRequest(createBookSchema),
  createBook
);

router.put("/:id", uploadImages.single("image"), validateRequest(updateBookSchema), updateBook);

router.delete("/:id", deleteBook);

export default router;
