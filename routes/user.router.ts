import { Router } from "express";
import { registerUser } from "../controller/user.controller.ts";

const router = Router();

router.post('/register', registerUser);

export default router;