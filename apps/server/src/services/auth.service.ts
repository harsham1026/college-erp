import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole } from '@prisma/client';
import prisma from '../config/database';
import { redis } from '../config/redis';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import type { JwtPayload } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export class AuthService {
  // ============================================
  // Register
  // ============================================
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: data.role || UserRole.STUDENT,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Create OTP for email verification
    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        otp: await bcrypt.hash(otp, 10),
        type: 'EMAIL_VERIFICATION',
        expiresAt: otpExpiry,
      },
    });

    logger.info(`User registered: ${user.email} (OTP: ${otp})`);

    return {
      user,
      otp, // In production, this would be sent via email only
    };
  }

  // ============================================
  // Login
  // ============================================
  async login(data: {
    email: string;
    password: string;
    rememberMe?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await this.recordLoginHistory(null, data.ipAddress, data.userAgent, 'FAILED');
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 403);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      await this.recordLoginHistory(user.id, data.ipAddress, data.userAgent, 'FAILED');
      throw new AppError('Invalid email or password', 401);
    }

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: user.id, twoFactor: true },
        JWT_SECRET,
        { expiresIn: '5m' },
      );
      return { requiresTwoFactor: true, tempToken };
    }

    // Generate tokens
    const tokens = this.generateTokens({ id: user.id, email: user.email, role: user.role });
    const refreshExpiresIn = data.rememberMe ? '30d' : '7d';
    const refreshExpiry = data.rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        expiresAt: refreshExpiry,
      },
    });

    // Record login
    await this.recordLoginHistory(user.id, data.ipAddress, data.userAgent, 'SUCCESS');
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  // ============================================
  // Refresh Token
  // ============================================
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;
      const session = await prisma.userSession.findFirst({
        where: {
          userId: decoded.id,
          refreshToken,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokens = this.generateTokens({
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      });

      // Rotate refresh token
      await prisma.userSession.update({
        where: { id: session.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return tokens;
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  // ============================================
  // Logout
  // ============================================
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await prisma.userSession.updateMany({
        where: { userId, refreshToken },
        data: { isActive: false },
      });
    } else {
      // Logout from all devices
      await prisma.userSession.updateMany({
        where: { userId },
        data: { isActive: false },
      });
    }
  }

  // ============================================
  // Forgot Password
  // ============================================
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        otp: await bcrypt.hash(otp, 10),
        type: 'PASSWORD_RESET',
        expiresAt: otpExpiry,
      },
    });

    logger.info(`Password reset OTP for ${email}: ${otp}`);
    // In production: send email

    return { message: 'If the email exists, a reset OTP has been sent' };
  }

  // ============================================
  // Verify OTP
  // ============================================
  async verifyOtp(email: string, otp: string, type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET') {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        userId: user.id,
        type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new AppError('OTP expired or not found', 400);
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) {
      throw new AppError('Invalid OTP', 400);
    }

    // Mark OTP as used
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    if (type === 'EMAIL_VERIFICATION') {
      await prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      });
    }

    // Generate a temporary reset token if password reset
    if (type === 'PASSWORD_RESET') {
      const resetToken = jwt.sign({ id: user.id, purpose: 'reset' }, JWT_SECRET, {
        expiresIn: '10m',
      });
      return { verified: true, resetToken };
    }

    return { verified: true };
  }

  // ============================================
  // Reset Password
  // ============================================
  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; purpose: string };
      if (decoded.purpose !== 'reset') {
        throw new AppError('Invalid reset token', 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashedPassword },
      });

      // Invalidate all sessions
      await prisma.userSession.updateMany({
        where: { userId: decoded.id },
        data: { isActive: false },
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new AppError('Invalid or expired reset token', 400);
    }
  }

  // ============================================
  // Change Password
  // ============================================
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  // ============================================
  // Get Profile
  // ============================================
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        city: true,
        state: true,
        country: true,
        role: true,
        isEmailVerified: true,
        isTwoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        student: true,
        teacher: true,
        parent: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // ============================================
  // Get Login History
  // ============================================
  async getLoginHistory(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [history, total] = await Promise.all([
      prisma.loginHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.loginHistory.count({ where: { userId } }),
    ]);

    return {
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  // ============================================
  // Get Active Sessions
  // ============================================
  async getSessions(userId: string) {
    return prisma.userSession.findMany({
      where: { userId, isActive: true, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        deviceType: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ============================================
  // Revoke Session
  // ============================================
  async revokeSession(userId: string, sessionId: string) {
    const session = await prisma.userSession.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) {
      throw new AppError('Session not found', 404);
    }
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  // ============================================
  // Helpers
  // ============================================
  private generateTokens(payload: JwtPayload) {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN as any,
    });
    return { accessToken, refreshToken };
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  private async recordLoginHistory(
    userId: string | null,
    ipAddress?: string,
    userAgent?: string,
    status: string = 'SUCCESS',
  ) {
    if (userId) {
      await prisma.loginHistory.create({
        data: {
          userId,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          status,
        },
      });
    }
  }
}

export const authService = new AuthService();
