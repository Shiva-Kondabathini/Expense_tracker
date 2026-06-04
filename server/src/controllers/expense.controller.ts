import { Response } from "express";

import { Expense } from "../models/expense.model";
import { AuthRequest } from "../types/auth.types";

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      userId: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await Expense.find({
      userId: req.user?.userId,
    })
      .select("_id title amount category date createdAt updatedAt")
      .sort({
        createdAt: -1,
      })
      .lean();

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.userId,
    })
      .select("_id")
      .lean();

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user?.userId,
      },
      req.body,
      {
        new: true,
      },
    )
      .select("_id title amount category date createdAt updatedAt")
      .lean();

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
