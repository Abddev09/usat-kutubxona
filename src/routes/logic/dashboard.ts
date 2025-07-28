import { Router } from "express";
import { dashboardNumber } from "../../logic/Dashboard";
const router = Router();

router.get("/", dashboardNumber);
export default router;
