import { Router } from "express";
const router = Router();
import {
  getAllGroupPermissions,
  getGroupPermission,
  createGroupPermission,
  updateGroupPermission,
  deleteGroupPermission,
  assignPermissionsToGroup,
} from "../controllers/groupPermisson.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createGroupPermissionSchema } from "../validations/groupPermission.validation";
router.get("/", getAllGroupPermissions);
router.get("/:id", getGroupPermission);
router.post(
  "/",
  validateRequest(createGroupPermissionSchema),
  createGroupPermission
);
router.put(
  "/:id",
  validateRequest(createGroupPermissionSchema),
  updateGroupPermission
);
router.delete("/:id", deleteGroupPermission);
router.post("/assign", assignPermissionsToGroup);
export default router;
