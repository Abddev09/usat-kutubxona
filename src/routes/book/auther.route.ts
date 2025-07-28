import { Router } from "express";
const router = Router();
import {
  getAuther,
  getAllAuthers,
  createAuther,
  updateAuther,
  deleteAuther,
} from "../../controllers/book/auther.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createAutherSchema,
  updateAutherSchema,
} from "../../validations/auther.validation";
router.post(
  "/",
  validateRequest(createAutherSchema),
  createAuther
);
router.get("/", getAllAuthers);
router.get("/:id", getAuther);
router.put(
  "/:id",
  validateRequest(updateAutherSchema),
  updateAuther
);
router.delete("/:id", deleteAuther);
export default router;
