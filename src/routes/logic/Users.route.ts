import { Router } from "express";
import { getAllUsers } from "../../logic/Users.admin";

const router = Router();

router.get("/", getAllUsers);

export default router;
