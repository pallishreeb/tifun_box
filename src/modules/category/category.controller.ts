import { Request, Response, NextFunction } from "express";
import * as service from "./category.service";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await service.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

export const list = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await service.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};
