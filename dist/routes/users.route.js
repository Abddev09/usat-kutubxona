"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const validateRequest_1 = require("../middlewares/validateRequest");
const user_validation_1 = require("../validations/user.validation");
const authorize_1 = require("../middlewares/authorize");
const checkPermission_1 = require("../middlewares/checkPermission");
const router = (0, express_1.Router)();
router.get("/", users_controller_1.getAllUsers);
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.registerUserSchema), users_controller_1.registerUser);
router.put("/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserSchema), users_controller_1.updateUser);
router.delete("/:id", users_controller_1.deleteUser);
router.get("/:id", users_controller_1.getUser);
router.get("/users/deleted", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), users_controller_1.getDeletedUsers);
router.patch("/:id/restore", // to‘g‘rilangan
authorize_1.isAuthenticated, users_controller_1.restoreUser);
exports.default = router;
