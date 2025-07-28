import { Router } from "express";
import {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
  getUser,
  getDeletedUsers,
  restoreUser,
} from "../controllers/users.controller";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerUserSchema,
  updateUserSchema,
} from "../validations/user.validation";
import { isAuthenticated } from "../middlewares/authorize";
import { checkDynamicPermission } from "../middlewares/checkPermission";
const router = Router();
router.get("/", getAllUsers);
router.post("/register", validateRequest(registerUserSchema), registerUser);
router.put("/:id", validateRequest(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.get(
  "/users/deleted",
  isAuthenticated,
  checkDynamicPermission(),
  getDeletedUsers
);

router.patch(
  "/:id/restore", // to‘g‘rilangan
  isAuthenticated,
  restoreUser
);
export default router;
