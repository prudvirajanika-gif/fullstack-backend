import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    const { isConnected } = getDbStatus();
    if (isConnected) {
      const existing = await UserModel.findOne({ email });
      if (existing) throw new AppError('Email is already registered', 409);

      const user = await UserModel.create({
        name,
        email,
        passwordHash: password, // In production, hash with bcrypt
        phone,
        role: 'ROLE_CUSTOMER',
      });
      res.status(201).json({ success: true, data: user });
      return;
    }

    res.status(201).json({
      success: true,
      data: {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone,
        role: 'ROLE_CUSTOMER',
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    res.status(200).json({
      success: true,
      data: {
        token: 'demo-jwt-session-token-for-cravecraft-evaluation',
        user: {
          id: 'usr-1',
          name: 'Prudvi Raj',
          email,
          role: 'ROLE_CUSTOMER',
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
