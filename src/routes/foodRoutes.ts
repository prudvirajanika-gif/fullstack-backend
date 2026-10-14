import { Router } from 'express';
import { getFoods, getFoodById, createFood } from '../controllers/foodController.js';

const router = Router();
router.get('/', getFoods);
router.get('/:id', getFoodById);
router.post('/', createFood);

export default router;
