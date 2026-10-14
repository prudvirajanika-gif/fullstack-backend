import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/food_ordering_db',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'cravecraft_super_secret_jwt_key_2026',
};
