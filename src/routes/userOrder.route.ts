import { Router } from "express";
import {
  createUserOrder,
  getAllUserOrders,
  getUserOrder,
  updateUserOrder,
  deleteUserOrder,
  extendUserOrder,
  confirmUserOrder,
  markOrderReadyForPickup,
  returnBookWithCheck,
  rejectUserOrder,
  removeFromBlacklist,
} from "../controllers/userOrder.controller";

import { validateRequest } from "../middlewares/validateRequest";
import {
  createUserOrderSchema,
  updateUserOrderSchema,
  extendUserOrderSchema,
  confirmUserOrderSchema,
} from "../validations/userOrder.validation";
import { isAuthenticated } from "../middlewares/authorize";
import { checkDynamicPermission } from "../middlewares/checkPermission";

const router = Router();

router.post("/", validateRequest(createUserOrderSchema), createUserOrder);
router.get("/", isAuthenticated, checkDynamicPermission(), getAllUserOrders);
router.get("/:id", isAuthenticated, checkDynamicPermission(), getUserOrder);
router.put(
  "/:id",
  isAuthenticated,
  checkDynamicPermission(),
  validateRequest(updateUserOrderSchema),
  updateUserOrder
);
router.delete("/:id", deleteUserOrder);
router.patch(
  "/:id/extend",
  validateRequest(extendUserOrderSchema),
  extendUserOrder
);
router.post(
  "/:id/checked",
  isAuthenticated,
  checkDynamicPermission(),
  validateRequest(confirmUserOrderSchema),
  confirmUserOrder
);
router.patch("/:id/ready", isAuthenticated, markOrderReadyForPickup);
router.patch("/:id/reject", isAuthenticated, rejectUserOrder);
router.post(
  "/:id/return-check",
  isAuthenticated,
  checkDynamicPermission(),
  validateRequest(confirmUserOrderSchema),
  returnBookWithCheck
);
router.patch("/:id/remove-blacklist", isAuthenticated, removeFromBlacklist);
export default router;
