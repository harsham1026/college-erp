import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authRateLimiter } from '../middleware/rateLimiter';
import { loginSchema, registerSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema, changePasswordSchema } from '@college-erp/shared';

const router = Router();

// Public routes
router.post('/register', authRateLimiter, validate(registerSchema), authController.register);
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-otp', authRateLimiter, validate(verifyOtpSchema), authController.verifyOtp);
router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.use(authenticate);
router.post('/logout', authController.logout);
router.post('/change-password', validate(changePasswordSchema), authController.changePassword);
router.get('/profile', authController.getProfile);
router.get('/login-history', authController.getLoginHistory);
router.get('/sessions', authController.getSessions);
router.delete('/sessions/:sessionId', authController.revokeSession);

export default router;
