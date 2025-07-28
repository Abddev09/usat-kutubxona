import { Router } from "express";

const router = Router();

import userRouter from "./users.route";
import groupRouter from "./groups.route";
import userGroupRouter from "./userGroup.route";
import permissionRouter from "./permission.route";
import groupPermissionRouter from "./groupPermissoin";
import kafedraRouter from "./kafedra.route";
import yonalishRouter from "./yonalish.route";
import studentGroupRouter from "./studentGroup.route";
import alphabetRouter from "./book/alphabet.route";
import autherRouter from "./book/auther.route";
import bookRouter from "./book/book.route";
import statusRouter from "./book/status.route";
import bookItemRouter from "./book/bookItem.route";
import languageRouter from "./book/language.route";
import categoryRouter from "./book/category.route";
import bookCategoryRouter from "./book/bookCategory.route";
import userOrderRouter from "./userOrder.route";
import telegramRouter from "./logic/telegram.router";
import usersRouter from "./logic/Users.route";
import loginRouter from "./logic/admin.route";
import bookGivenRouter from "./bookGiven.route";
import orderHistoryRouter from "./orderHistory.route";
import { checkDynamicPermission } from "../middlewares/checkPermission";
import { isAuthenticated } from "../middlewares/authorize";
import dashboardRouter from "./logic/dashboard";
import { RegisterPage } from "../logic/Admin";
import AllControllerRouter from "./allcontroller.route";
import BookCategoryKafedraRouter from "./BookCategoryKafedra.route";
import websiteRouter from "./website.route";
router.use("/users", userRouter);
router.use("/groups", groupRouter);
router.use(
  "/user-groups",
  isAuthenticated,
  checkDynamicPermission(),
  userGroupRouter
);
router.use("/permissions", isAuthenticated, permissionRouter);
router.use("/group-permissions", isAuthenticated, groupPermissionRouter);
router.use(
  "/alphabet",
  isAuthenticated,
  checkDynamicPermission(),
  alphabetRouter
);
// Kafedra, Yonalish, StudentGroup
router.use(
  "/kafedra",
  isAuthenticated,
  checkDynamicPermission(),
  kafedraRouter
);
router.use(
  "/yonalish",
  isAuthenticated,
  checkDynamicPermission(),
  yonalishRouter
);
router.use(
  "/student-groups",
  isAuthenticated,
  checkDynamicPermission(),
  studentGroupRouter
);
// Book router
router.use("/auther", isAuthenticated, checkDynamicPermission(), autherRouter);
router.use("/books", isAuthenticated, checkDynamicPermission(), bookRouter);
router.use("/status", isAuthenticated, checkDynamicPermission(), statusRouter);
router.use(
  "/book-items",
  // isAuthenticated,
  // checkDynamicPermission(),
  bookItemRouter
);
router.use(
  "/languages",
  isAuthenticated,
  checkDynamicPermission(),
  languageRouter
);
router.use(
  "/categories",
  // isAuthenticated,
  // checkDynamicPermission(),
  categoryRouter
);
router.use(
  "/book-categories",
  isAuthenticated,
  checkDynamicPermission(),
  bookCategoryRouter
);
router.use(
  "/user-order",

  userOrderRouter
);

// Telegram  cheking
router.use("/telegram", telegramRouter);
// Users admin
router.use(
  "/all-users",
  isAuthenticated,
  checkDynamicPermission(),
  usersRouter
);
// Admin Login
router.use("/admin", loginRouter);
router.use(
  "/dashboard",
  isAuthenticated,
  checkDynamicPermission(),
  dashboardRouter
);
// histoy
router.use(
  "/order-history",
  isAuthenticated,
  checkDynamicPermission(),
  orderHistoryRouter
);
// topshirilgan kitoblar
router.use(
  "/given-books",
  isAuthenticated,
  checkDynamicPermission(),
  bookGivenRouter
);
router.post("/register", RegisterPage);
router.use(
  "/all-orders-kafedra",
  isAuthenticated,
  checkDynamicPermission(),
  AllControllerRouter
);

// website routes

router.use("/website", websiteRouter);
router.use("/book-category-kafedra", BookCategoryKafedraRouter);
export default router;
