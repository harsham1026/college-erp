import { Router } from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { createCrudService } from '../services/crud.service';
import { createCrudController } from '../controllers/crud.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { feeSchema, paymentSchema } from '@college-erp/shared';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';
import { v4 as uuid } from 'uuid';

// ============================================
// Fee Routes
// ============================================
const feeRouter = Router();

const feeService = createCrudService('fee', {
  searchFields: ['name'],
  defaultInclude: { course: true, semester: true },
  cachePrefix: 'fees',
});

const feeController = createCrudController(feeService);

feeRouter.use(authenticate);
feeRouter.get('/', feeController.getAll);
feeRouter.get('/:id', feeController.getById);
feeRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT), validate(feeSchema), feeController.create);
feeRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT), validate(feeSchema), feeController.update);
feeRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), feeController.delete);

// ============================================
// Payment Routes
// ============================================
const paymentRouter = Router();

paymentRouter.use(authenticate);

// Create payment
paymentRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT), validate(paymentSchema), asyncHandler(async (req: Request, res: Response) => {
  const { studentId, feeId, amount, method, transactionId, remarks } = req.body;

  const receiptNo = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  const payment = await prisma.payment.create({
    data: {
      studentId,
      feeId,
      amount,
      method,
      transactionId,
      remarks,
      receiptNo,
      status: 'PAID',
      paidAt: new Date(),
    },
    include: {
      student: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
      fee: true,
    },
  });

  res.status(201).json({ success: true, message: 'Payment recorded', data: payment });
}));

// Get payments
paymentRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, studentId, feeId, status, startDate, endDate } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const where: any = {};
  if (studentId) where.studentId = studentId;
  if (feeId) where.feeId = feeId;
  if (status) where.status = status;
  if (startDate && endDate) {
    where.paidAt = { gte: new Date(startDate), lte: new Date(endDate) };
  }

  const [data, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
        fee: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.payment.count({ where }),
  ]);

  res.json({
    success: true,
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}));

// Get payment by ID
paymentRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const payment = await prisma.payment.findUnique({
    where: { id: req.params.id as string },
    include: {
      student: { include: { user: true } },
      fee: { include: { course: true, semester: true } },
    },
  });
  res.json({ success: true, data: payment });
}));

// Student fee summary
paymentRouter.get('/student/:studentId/summary', asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const student = await prisma.student.findUnique({
    where: { id: studentId as string },
    include: { course: true, semester: true },
  });

  if (!student) {
    res.status(404).json({ success: false, message: 'Student not found' });
    return;
  }

  const fees = await prisma.fee.findMany({
    where: { courseId: student.courseId },
    include: {
      payments: { where: { studentId: studentId as string } },
    },
  });

  const summary = fees.map((fee: any) => {
    const totalPaid = fee.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    return {
      feeId: fee.id,
      feeName: fee.name,
      feeType: fee.type,
      totalAmount: fee.amount,
      totalPaid,
      balance: fee.amount - totalPaid,
      dueDate: fee.dueDate,
      status: totalPaid >= fee.amount ? 'PAID' : totalPaid > 0 ? 'PARTIAL' : new Date() > fee.dueDate ? 'OVERDUE' : 'PENDING',
    };
  });

  const totalFees = summary.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPaid = summary.reduce((sum, s) => sum + s.totalPaid, 0);

  res.json({
    success: true,
    data: {
      fees: summary,
      total: { totalFees, totalPaid, balance: totalFees - totalPaid },
    },
  });
}));

export { feeRouter, paymentRouter };
