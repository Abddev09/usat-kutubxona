import { Router } from "express";
const router = Router();
import {
  LoginPage,
  RegisterPage,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../../logic/Admin";
import { checkDynamicPermission } from "../../middlewares/checkPermission";
import { isAuthenticated } from "../../middlewares/authorize";
router.post("/log", LoginPage);
router.post(
  "/register",
  isAuthenticated,
  checkDynamicPermission(),
  RegisterPage
);
router.get(
  "/all-users",
  isAuthenticated,
  checkDynamicPermission(),
  getAllUsers
);
router.get("/user/:id", isAuthenticated, checkDynamicPermission(), getUser);
router.put("/user/:id", isAuthenticated, checkDynamicPermission(), updateUser);
router.delete(
  "/user/:id",
  isAuthenticated,
  checkDynamicPermission(),
  deleteUser
);
export default router;
