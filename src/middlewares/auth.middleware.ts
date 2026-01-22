import { Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { Role } from "@prisma/client";
import { prisma } from '../config/db'

interface JwtPayload {
  id: string;
  role: 'USER' | 'BRAND' | 'ADMIN';
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
  brand?: {
    id: string;
    role: Role;
  };
}

export const authMiddleware = async (req:AuthRequest, res:Response, next:NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    let account;

    if (decoded.role === 'USER') {
      account = await prisma.user.findUnique({ where: { id: decoded.id } });
    } 
    else if (decoded.role === 'BRAND') {
      account = await prisma.brand.findUnique({ where: { id: decoded.id } });
    }

    if (!account) {
      return res.status(401).json({ message: 'Account not found' });
    }

    // Verify session token matches (prevents token reuse after logout)
    if (!account.sessionToken) {
      return res.status(401).json({ message: 'Session expired' });
    }

    if (decoded.role === 'USER') {
      req.user = { id: decoded.id, role: decoded.role as Role };
    }

    if (decoded.role === 'BRAND') {
      req.brand = { id: decoded.id, role: decoded.role as Role };
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
