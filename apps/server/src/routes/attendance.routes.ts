import { Router } from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, isTeacherOrAbove } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { attendanceSchema } from '@college-erp/shared';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Take attendance (batch)
router.post('/', isTeacherOrAbove, validate(attendanceSchema), asyncHandler(async (req: Request, res: Response) => {
  const { subjectId, date, records } = req.body;
  const teacherId = req.user!.id;

  // Get teacher record
  const teacher = await prisma.teacher.findFirst({ where: { userId: teacherId } });
  if (!teacher && req.user!.role === UserRole.TEACHER) {
    res.status(400).json({ success: false, message: 'Teacher profile not found' });
    return;
  }

  const attendanceData = records.map((record: any) => ({
    studentId: record.studentId,
    subjectId,
    teacherId: teacher?.id || teacherId,
    date: new Date(date),
    status: record.status,
    method: 'MANUAL' as const,
  }));

  // Upsert attendance records
  const results = await Promise.all(
    attendanceData.map((data: any) =>
      prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: data.studentId,
            subjectId: data.subjectId,
            date: data.date,
          },
        },
        update: { status: data.status },
        create: data,
      }),
    ),
  );

  res.json({
    success: true,
    message: `Attendance recorded for ${results.length} students`,
    data: results,
  });
}));

// Get attendance by subject and date
router.get('/subject/:subjectId', asyncHandler(async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const { date, startDate, endDate } = req.query as any;

  const where: any = { subjectId };

  if (date) {
    where.date = new Date(date);
  } else if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      student: {
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  res.json({ success: true, data: attendance });
}));

// Get student attendance summary
router.get('/student/:studentId', asyncHandler(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { semesterId } = req.query as any;

  const where: any = { studentId };

  const attendance = await prisma.attendance.findMany({
    where,
    include: { subject: true },
  });

  // Calculate percentage per subject
  const subjectMap = new Map<string, { total: number; present: number; subjectName: string; subjectCode: string }>();

  attendance.forEach((record) => {
    const key = record.subjectId;
    if (!subjectMap.has(key)) {
      subjectMap.set(key, { total: 0, present: 0, subjectName: record.subject.name, subjectCode: record.subject.code });
    }
    const entry = subjectMap.get(key)!;
    entry.total++;
    if (record.status === 'PRESENT' || record.status === 'LATE') {
      entry.present++;
    }
  });

  const summary = Array.from(subjectMap.entries()).map(([subjectId, data]) => ({
    subjectId,
    subjectName: data.subjectName,
    subjectCode: data.subjectCode,
    totalClasses: data.total,
    present: data.present,
    absent: data.total - data.present,
    percentage: Math.round((data.present / data.total) * 100 * 100) / 100,
  }));

  const overallTotal = attendance.length;
  const overallPresent = attendance.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;

  res.json({
    success: true,
    data: {
      subjects: summary,
      overall: {
        totalClasses: overallTotal,
        present: overallPresent,
        absent: overallTotal - overallPresent,
        percentage: overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100 * 100) / 100 : 0,
      },
    },
  });
}));

// Get attendance report
router.get('/report', isTeacherOrAbove, asyncHandler(async (req: Request, res: Response) => {
  const { subjectId, startDate, endDate, sectionId } = req.query as any;

  const where: any = {};
  if (subjectId) where.subjectId = subjectId;
  if (startDate && endDate) {
    where.date = { gte: new Date(startDate), lte: new Date(endDate) };
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      student: {
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
      subject: true,
    },
    orderBy: [{ date: 'desc' }, { student: { enrollmentNo: 'asc' } }],
  });

  res.json({ success: true, data: attendance });
}));

export default router;
