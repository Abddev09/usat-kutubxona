import { Router } from "express";
import {
  getOrderHistory,
  getAllOrderHistory,
} from "../controllers/orderHistory.controller";

const router = Router();

// @desc Get one order history (by user_order_id)
router.get("/:user_order_id", getOrderHistory);

// @desc Get all order histories
router.get("/", getAllOrderHistory);

export default router;
