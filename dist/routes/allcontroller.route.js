"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const allcontroller_1 = require("../controllers/allcontroller");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/user-orders/kafedra
 * @desc    Barcha buyurtmalar ro'yxati (Kafedrasiz)
 * @query   lang=uz|ru
 * @access  Public
 */
router.get("/kafedra", allcontroller_1.getAllOrdersKafedra);
exports.default = router;
