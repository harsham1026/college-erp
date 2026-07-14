import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authService } from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: result.user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  if ('requiresTwoFactor' in result) {
    res.json({
      success: true,
      message: 'Two-factor authentication required',
      data: { requiresTwoFactor: true, tempToken: result.tempToken },
    });
    return;
  }

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const result = await authService.refreshToken(token);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken: result.accessToken },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenCookie = req.cookies?.refreshToken;
  await authService.logout(req.user!.id, refreshTokenCookie);

  res.clearCookie('refreshToken');
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  res.json({ success: true, ...result });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, type } = req.body;
  const result = await authService.verifyOtp(email, otp, type || 'EMAIL_VERIFICATION');
  res.json({ success: true, message: 'OTP verified', data: result });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  res.json({ success: true, ...result });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user!.id, currentPassword, newPassword);
  res.json({ success: true, ...result });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await authService.getProfile(req.user!.id);
  res.json({ success: true, data: profile });
});

export const getLoginHistory = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = req.query as any;
  const result = await authService.getLoginHistory(req.user!.id, Number(page) || 1, Number(limit) || 10);
  res.json({ success: true, ...result });
});

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await authService.getSessions(req.user!.id);
  res.json({ success: true, data: sessions });
});

export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  await authService.revokeSession(req.user!.id, req.params.sessionId as string);
  res.json({ success: true, message: 'Session revoked' });
});
