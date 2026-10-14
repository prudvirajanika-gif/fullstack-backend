import { Request, Response, NextFunction } from 'express';
import { FoodModel } from '../models/Food.js';
import { getDbStatus } from '../config/db.js';
import { IN_MEMORY_STORE } from '../services/seedService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getFoods(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { categoryId, search } = req.query;
    const { isConnected } = getDbStatus();

    if (isConnected) {
      const filter: any = {};
      if (categoryId) filter.categoryId = categoryId;
      if (search) {
        filter.$or = [
          { name: { $regex: search as string, $options: 'i' } },
          { description: { $regex: search as string, $options: 'i' } },
        ];
      }
      const foods = await FoodModel.find(filter).populate('categoryId', 'name').sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: foods });
      return;
    }

    let foods = [...IN_MEMORY_STORE.foods];
    if (categoryId) {
      foods = foods.filter((f) => f.categoryId === categoryId);
    }
    if (search) {
      const query = (search as string).toLowerCase();
      foods = foods.filter(
        (f) => f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)
      );
    }
    res.status(200).json({ success: true, data: foods });
  } catch (err) {
    next(err);
  }
}

export async function getFoodById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { isConnected } = getDbStatus();

    if (isConnected) {
      const food = await FoodModel.findById(id).populate('categoryId', 'name');
      if (!food) throw new AppError('Food item not found', 404);
      res.status(200).json({ success: true, data: food });
      return;
    }

    const food = IN_MEMORY_STORE.foods.find((f) => f.id === id);
    if (!food) throw new AppError('Food item not found', 404);
    res.status(200).json({ success: true, data: food });
  } catch (err) {
    next(err);
  }
}

export async function createFood(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, price, imageUrl, categoryId, isVeg, preparationTimeMin } = req.body;
    if (!name || !price || !categoryId) {
      throw new AppError('Name, price, and categoryId are required', 400);
    }

    const { isConnected } = getDbStatus();
    if (isConnected) {
      const food = await FoodModel.create({
        name,
        description,
        price,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
        categoryId,
        isVeg: !!isVeg,
        preparationTimeMin: preparationTimeMin || 20,
      });
      res.status(201).json({ success: true, data: food });
      return;
    }

    const category = IN_MEMORY_STORE.categories.find((c) => c.id === categoryId);
    const newFood = {
      id: `f-${Date.now()}`,
      name,
      description,
      price: Number(price),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
      categoryId,
      categoryName: category?.name || 'Chef Specialty',
      isVeg: !!isVeg,
      rating: 4.8,
      preparationTimeMin: preparationTimeMin || 20,
      stockQuantity: 100,
      available: true,
    };
    IN_MEMORY_STORE.foods.push(newFood);
    res.status(201).json({ success: true, data: newFood });
  } catch (err) {
    next(err);
  }
}
