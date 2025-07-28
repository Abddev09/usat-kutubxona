import { Router } from "express";
import {
  getAllStatus,
  getStatus,
  createStatus,
  updateStatus,
  deleteStatus,
} from "../../controllers/book/status.controller";
const router = Router();

router.get("/", getAllStatus);
router.get("/:id", getStatus);
router.post("/", createStatus);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);
export default router;
