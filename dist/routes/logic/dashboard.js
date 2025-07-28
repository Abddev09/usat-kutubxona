"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Dashboard_1 = require("../../logic/Dashboard");
const router = (0, express_1.Router)();
router.get("/", Dashboard_1.dashboardNumber);
exports.default = router;
