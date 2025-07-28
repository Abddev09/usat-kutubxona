"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const users_route_1 = __importDefault(require("./users.route"));
const groups_route_1 = __importDefault(require("./groups.route"));
const userGroup_route_1 = __importDefault(require("./userGroup.route"));
const permission_route_1 = __importDefault(require("./permission.route"));
const groupPermissoin_1 = __importDefault(require("./groupPermissoin"));
const kafedra_route_1 = __importDefault(require("./kafedra.route"));
const yonalish_route_1 = __importDefault(require("./yonalish.route"));
const studentGroup_route_1 = __importDefault(require("./studentGroup.route"));
const alphabet_route_1 = __importDefault(require("./book/alphabet.route"));
const auther_route_1 = __importDefault(require("./book/auther.route"));
const book_route_1 = __importDefault(require("./book/book.route"));
const status_route_1 = __importDefault(require("./book/status.route"));
const bookItem_route_1 = __importDefault(require("./book/bookItem.route"));
const language_route_1 = __importDefault(require("./book/language.route"));
const category_route_1 = __importDefault(require("./book/category.route"));
const bookCategory_route_1 = __importDefault(require("./book/bookCategory.route"));
const userOrder_route_1 = __importDefault(require("./userOrder.route"));
const telegram_router_1 = __importDefault(require("./logic/telegram.router"));
const Users_route_1 = __importDefault(require("./logic/Users.route"));
const admin_route_1 = __importDefault(require("./logic/admin.route"));
const bookGiven_route_1 = __importDefault(require("./bookGiven.route"));
const orderHistory_route_1 = __importDefault(require("./orderHistory.route"));
const checkPermission_1 = require("../middlewares/checkPermission");
const authorize_1 = require("../middlewares/authorize");
const dashboard_1 = __importDefault(require("./logic/dashboard"));
const Admin_1 = require("../logic/Admin");
const allcontroller_route_1 = __importDefault(require("./allcontroller.route"));
const BookCategoryKafedra_route_1 = __importDefault(require("./BookCategoryKafedra.route"));
const website_route_1 = __importDefault(require("./website.route"));
router.use("/users", users_route_1.default);
router.use("/groups", groups_route_1.default);
router.use("/user-groups", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), userGroup_route_1.default);
router.use("/permissions", authorize_1.isAuthenticated, permission_route_1.default);
router.use("/group-permissions", authorize_1.isAuthenticated, groupPermissoin_1.default);
router.use("/alphabet", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), alphabet_route_1.default);
// Kafedra, Yonalish, StudentGroup
router.use("/kafedra", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), kafedra_route_1.default);
router.use("/yonalish", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), yonalish_route_1.default);
router.use("/student-groups", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), studentGroup_route_1.default);
// Book router
router.use("/auther", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), auther_route_1.default);
router.use("/books", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), book_route_1.default);
router.use("/status", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), status_route_1.default);
router.use("/book-items", 
// isAuthenticated,
// checkDynamicPermission(),
bookItem_route_1.default);
router.use("/languages", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), language_route_1.default);
router.use("/categories", 
// isAuthenticated,
// checkDynamicPermission(),
category_route_1.default);
router.use("/book-categories", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), bookCategory_route_1.default);
router.use("/user-order", userOrder_route_1.default);
// Telegram  cheking
router.use("/telegram", telegram_router_1.default);
// Users admin
router.use("/all-users", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), Users_route_1.default);
// Admin Login
router.use("/admin", admin_route_1.default);
router.use("/dashboard", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), dashboard_1.default);
// histoy
router.use("/order-history", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), orderHistory_route_1.default);
// topshirilgan kitoblar
router.use("/given-books", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), bookGiven_route_1.default);
router.post("/register", Admin_1.RegisterPage);
router.use("/all-orders-kafedra", authorize_1.isAuthenticated, (0, checkPermission_1.checkDynamicPermission)(), allcontroller_route_1.default);
// website routes
router.use("/website", website_route_1.default);
router.use("/book-category-kafedra", BookCategoryKafedra_route_1.default);
exports.default = router;
