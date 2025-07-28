import { Router } from "express";
import { getAllOrdersKafedra } from "../controllers/allcontroller";

const router = Router();

/**
 * @route   GET /api/v1/user-orders/kafedra
 * @desc    Barcha buyurtmalar ro'yxati (Kafedrasiz)
 * @query   lang=uz|ru
 * @access  Public
 */
router.get("/kafedra", getAllOrdersKafedra);

export default router;
