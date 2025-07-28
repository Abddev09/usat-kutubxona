"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const category_controller_1 = require("../../controllers/book/category.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const category_validation_1 = require("../../validations/category.validation");
const authorize_1 = require("../../middlewares/authorize");
router.get("/", category_controller_1.getAllCategories);
router.get("/:id", category_controller_1.getCategory);
router.post("/", 
// isAuthenticated,
(0, validateRequest_1.validateRequest)(category_validation_1.createCategorySchema), category_controller_1.createCategory);
router.put("/:id", authorize_1.isAuthenticated, (0, validateRequest_1.validateRequest)(category_validation_1.updateCategorySchema), category_controller_1.updateCategory);
router.delete("/:id", authorize_1.isAuthenticated, category_controller_1.deleteCategory);
router.get("/:id/books", category_controller_1.getBooksByCategoryAndKafedra);
exports.default = router;
