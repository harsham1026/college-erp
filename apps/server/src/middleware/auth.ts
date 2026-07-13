import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AppError } from './errorHandler';
import prisma from '../config/database';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1] ||
                  req.cookies?.accessToken;

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403,
      );
    }

    next();
  };
};

export const isSuperAdmin = authorize(UserRole.SUPER_ADMIN);

export const isAdminOrPrincipal = authorize(
  UserRole.SUPER_ADMIN,
  UserRole.PRINCIPAL,
  UserRole.VICE_PRINCIPAL,
);

export const isTeacherOrAbove = authorize(
  UserRole.SUPER_ADMIN,
  UserRole.PRINCIPAL,
  UserRole.VICE_PRINCIPAL,
  UserRole.HOD,
  UserRole.TEACHER,
);

export const isStudentOrAbove = authorize(
  UserRole.SUPER_ADMIN,
  UserRole.PRINCIPAL,
  UserRole.VICE_PRINCIPAL,
  UserRole.HOD,
  UserRole.TEACHER,
  UserRole.STUDENT,
);
