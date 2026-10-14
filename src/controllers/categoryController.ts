import { Request, Response, NextFunction } from 'express';
import { CategoryModel } from '../models/Category.js';
import { getDbStatus } from '../config/db.js';
import { IN_MEMORY_STORE } from '../services/seedService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      const categories = await CategoryModel.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: categories });
      return;
    }
    res.status(200).json({ success: true, data: IN_MEMORY_STORE.categories });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name || !description) {
      throw new AppError('Name and description are required', 400);
    }

    const { isConnected } = getDbStatus();
    if (isConnected) {
      const category = await CategoryModel.create({ name, description, imageUrl });
      res.status(201).json({ success: true, data: category });
      return;
    }

    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      description,
      imageUrl,
    };
    IN_MEMORY_STORE.categories.push(newCat);
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    next(err);
  }
}
