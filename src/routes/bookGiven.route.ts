import { Router } from "express";
import { getActiveGivenBooks } from "../controllers/bookGivenController";

const router = Router();
router.get("/active", getActiveGivenBooks);
export default router;
