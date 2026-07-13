import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './config/logger';
import routes from './routes';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));
app.use(rateLimiter);

// ============================================
// Routes
// ============================================
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'College ERP API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api', routes);

// ============================================
// Error Handler (must be last)
// ============================================
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
