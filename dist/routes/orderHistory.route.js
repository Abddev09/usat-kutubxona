"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderHistory_controller_1 = require("../controllers/orderHistory.controller");
const router = (0, express_1.Router)();
// @desc Get one order history (by user_order_id)
router.get("/:user_order_id", orderHistory_controller_1.getOrderHistory);
// @desc Get all order histories
router.get("/", orderHistory_controller_1.getAllOrderHistory);
exports.default = router;
