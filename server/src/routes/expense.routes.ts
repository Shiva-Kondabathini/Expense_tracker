import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller";

const router = Router();

router.post("/", authenticate, createExpense);

router.get("/", authenticate, getExpenses);

router.put("/:id", authenticate, updateExpense);

router.delete("/:id", authenticate, deleteExpense);

export default router;
