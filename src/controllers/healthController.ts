import { Request, Response } from 'express';
import { getDbStatus } from '../config/db.js';

export function getHealth(_req: Request, res: Response): void {
  const dbStatus = getDbStatus();
  res.status(200).json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'CraveCraft REST API Service',
    database: {
      connected: dbStatus.isConnected,
      mode: dbStatus.isConnected ? 'MongoDB Active' : 'In-Memory Fallback',
    },
  });
}
