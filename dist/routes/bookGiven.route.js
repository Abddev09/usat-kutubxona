"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookGivenController_1 = require("../controllers/bookGivenController");
const router = (0, express_1.Router)();
router.get("/active", bookGivenController_1.getActiveGivenBooks);
exports.default = router;
