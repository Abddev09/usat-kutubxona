import { Router } from "express";
const router = Router();

import {
  getAllKafedras,
  getKafedra,
  createKafedra,
  updateKafedra,
  deleteKafedra,
} from "../controllers/kafedra.controller";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createKafedraSchema,
  updateKafedraSchema,
} from "../validations/kafedra.validation";
import { checkDynamicPermission } from "../middlewares/checkPermission";
import { isAuthenticated } from "../middlewares/authorize";
router.get("/", getAllKafedras);
router.get("/:id", getKafedra);
router.post(
  "/",
  isAuthenticated,
  validateRequest(createKafedraSchema),
  createKafedra
);
router.put(
  "/:id",
  isAuthenticated,
  validateRequest(updateKafedraSchema),
  updateKafedra
);
router.delete("/:id", isAuthenticated, deleteKafedra);
export default router;
