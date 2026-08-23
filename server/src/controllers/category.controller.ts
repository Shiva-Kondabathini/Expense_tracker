import { Request, Response } from "express";
import { Category } from "../models/category.model";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find().select("_id name").sort({ name: 1 });

  res.json({
    success: true,
    categories,
  });
};
