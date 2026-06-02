import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller";
import { verify } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verify/:token", verify);

router.get("/me", authenticate, getCurrentUser);

export default router;
