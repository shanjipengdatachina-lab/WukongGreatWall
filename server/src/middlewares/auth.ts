import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models';

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    status: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, config.jwt.secret as string) as { id: number };
    const user = await User.findByPk(decoded.id);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

export { AuthRequest };
