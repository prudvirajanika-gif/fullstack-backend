import { Request, Response, NextFunction } from 'express';
import { OrderModel, OrderStatus } from '../models/Order.js';
import { getDbStatus } from '../config/db.js';
import { IN_MEMORY_STORE } from '../services/seedService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { customerName, customerPhone, deliveryAddress, items, paymentMethod, notes } = req.body;

    if (!customerName || !customerPhone || !deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('Customer details and at least one order item are required', 400);
    }

    // Calculate subtotal, 5% GST tax, delivery fee
    const formattedItems = items.map((i: any) => {
      const food = IN_MEMORY_STORE.foods.find((f) => f.id === i.foodId) || {
        name: i.name || 'Gourmet Dish',
        price: i.price || 250,
      };
      return {
        foodId: i.foodId,
        name: food.name,
        price: food.price,
        quantity: i.quantity || 1,
      };
    });

    const subtotal = formattedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    const gstTax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = subtotal > 299 ? 0 : 40;
    const totalAmount = subtotal + gstTax + deliveryFee;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const { isConnected } = getDbStatus();
    if (isConnected) {
      const order = await OrderModel.create({
        customerName,
        customerPhone,
        deliveryAddress,
        items: formattedItems,
        subtotal,
        gstTax,
        deliveryFee,
        totalAmount,
        status: 'PENDING',
        paymentMethod: paymentMethod || 'ONLINE',
        otp,
        notes,
      });
      res.status(201).json({ success: true, data: order });
      return;
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      deliveryAddress,
      items: formattedItems,
      subtotal,
      gstTax,
      deliveryFee,
      totalAmount,
      status: 'PENDING' as OrderStatus,
      paymentMethod: paymentMethod || 'ONLINE',
      otp,
      notes,
      createdAt: new Date().toISOString(),
    };
    IN_MEMORY_STORE.orders.unshift(newOrder);
    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      const orders = await OrderModel.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: orders });
      return;
    }
    res.status(200).json({ success: true, data: IN_MEMORY_STORE.orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { isConnected } = getDbStatus();

    if (isConnected) {
      const order = await OrderModel.findById(id);
      if (!order) throw new AppError('Order not found', 404);
      res.status(200).json({ success: true, data: order });
      return;
    }

    const order = IN_MEMORY_STORE.orders.find((o) => o.id === id);
    if (!order) throw new AppError('Order not found', 404);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: OrderStatus[] = ['PENDING', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status. Allowed values: ${validStatuses.join(', ')}`, 400);
    }

    const { isConnected } = getDbStatus();
    if (isConnected) {
      const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) throw new AppError('Order not found', 404);
      res.status(200).json({ success: true, data: order });
      return;
    }

    const order = IN_MEMORY_STORE.orders.find((o) => o.id === id);
    if (!order) throw new AppError('Order not found', 404);
    order.status = status;
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}
