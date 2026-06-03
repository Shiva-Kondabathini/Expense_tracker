import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";

import {
  register,
  login,
  getCurrentUser,
  verify,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verify/:token", verify);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/me", authenticate, getCurrentUser);

export default router;
