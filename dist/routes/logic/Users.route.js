"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Users_admin_1 = require("../../logic/Users.admin");
const router = (0, express_1.Router)();
router.get("/", Users_admin_1.getAllUsers);
exports.default = router;
