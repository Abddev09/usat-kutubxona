import { Router } from "express";
const router = Router();

import {
  getAlphabet,
  getAllAlphabets,
  createAlphabet,
  updateAlphabet,
  deleteAlphabet,
} from "../../controllers/book/alphabet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createAlphabetSchema,
  updateAlphabetSchema,
} from "../../validations/alphabet.validation";
router.post(
  "/",
  validateRequest(createAlphabetSchema),
  createAlphabet
);
router.get("/", getAllAlphabets);
router.get("/:id", getAlphabet);
router.put("/:id", validateRequest(updateAlphabetSchema), updateAlphabet);
router.delete("/:id", deleteAlphabet);
export default router;
