import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import foodRoutes from './foodRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import authRoutes from './authRoutes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/foods', foodRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/auth', authRoutes);

export default apiRouter;
