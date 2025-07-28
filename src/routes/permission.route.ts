import { Router } from "express";
import {
  getAllPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createPermissionSchema } from "../validations/permission.validation";
const router = Router();
router.get("/", getAllPermissions);
router.get("/:id", getPermission);
router.post("/", validateRequest(createPermissionSchema), createPermission);
router.put("/:id", validateRequest(createPermissionSchema), updatePermission);
router.delete("/:id", deletePermission);
export default router;
