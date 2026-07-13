import { Router } from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

const router = Router();
router.use(authenticate);

// ============================================
// Admin Dashboard Stats
// ============================================
router.get('/admin', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.VICE_PRINCIPAL), asyncHandler(async (req: Request, res: Response) => {
  const [
    totalStudents,
    totalTeachers,
    totalCourses,
    totalDepartments,
    totalColleges,
    recentStudents,
    recentPayments,
    recentAnnouncements,
  ] = await Promise.all([
    prisma.student.count({ where: { isActive: true } }),
    prisma.teacher.count({ where: { isActive: true } }),
    prisma.course.count({ where: { isActive: true } }),
    prisma.department.count({ where: { isActive: true } }),
    prisma.college.count({ where: { isActive: true } }),
    prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true, email: true, avatar: true } }, course: true },
    }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { include: { user: { select: { firstName: true, lastName: true } } } },
        fee: true,
      },
    }),
    prisma.announcement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { firstName: true, lastName: true } } },
    }),
  ]);

  // Fee analytics
  const totalFeeCollected = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: 'PAID' },
  });

  // Attendance today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const attendanceToday = await prisma.attendance.groupBy({
    by: ['status'],
    _count: true,
    where: { date: { gte: today } },
  });

  res.json({
    success: true,
    data: {
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalDepartments,
        totalColleges,
        totalFeeCollected: totalFeeCollected._sum.amount || 0,
      },
      attendanceToday,
      recentStudents,
      recentPayments,
      recentAnnouncements,
    },
  });
}));

// ============================================
// Teacher Dashboard Stats
// ============================================
router.get('/teacher', authorize(UserRole.TEACHER, UserRole.HOD, UserRole.SUPER_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const teacher = await prisma.teacher.findFirst({ where: { userId } });

  if (!teacher) {
    res.json({ success: true, data: { message: 'No teacher profile found' } });
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalSubjects,
    todayClasses,
    pendingHomework,
    recentAttendance,
    leaveRequests,
  ] = await Promise.all([
    prisma.subjectTeacher.count({ where: { teacherId: teacher.id } }),
    prisma.timetableSlot.findMany({
      where: { teacherId: teacher.id, dayOfWeek: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1, isActive: true },
      include: { subject: true, section: true },
      orderBy: { startTime: 'asc' },
    }),
    prisma.homework.count({
      where: { teacherId: teacher.id, dueDate: { gte: today } },
    }),
    prisma.attendance.findMany({
      where: { teacherId: teacher.id, date: { gte: today } },
      include: { subject: true },
    }),
    prisma.leaveRequest.findMany({
      where: { teacherId: teacher.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  res.json({
    success: true,
    data: {
      stats: { totalSubjects, pendingHomework },
      todayClasses,
      recentAttendance,
      leaveRequests,
    },
  });
}));

// ============================================
// Student Dashboard Stats
// ============================================
router.get('/student', authorize(UserRole.STUDENT, UserRole.SUPER_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const student = await prisma.student.findFirst({
    where: { userId },
    include: { course: true, semester: true },
  });

  if (!student) {
    res.json({ success: true, data: { message: 'No student profile found' } });
    return;
  }

  const [
    attendanceSummary,
    pendingHomework,
    pendingAssignments,
    recentResults,
    notifications,
    feeStatus,
  ] = await Promise.all([
    prisma.attendance.findMany({
      where: { studentId: student.id },
      include: { subject: true },
    }),
    prisma.homework.findMany({
      where: {
        subject: { courseId: student.courseId, semesterId: student.semesterId },
        dueDate: { gte: new Date() },
      },
      include: { subject: true, submissions: { where: { studentId: student.id } } },
      take: 5,
      orderBy: { dueDate: 'asc' },
    }),
    prisma.assignment.findMany({
      where: {
        subject: { courseId: student.courseId, semesterId: student.semesterId },
        dueDate: { gte: new Date() },
      },
      include: { subject: true, submissions: { where: { studentId: student.id } } },
      take: 5,
      orderBy: { dueDate: 'asc' },
    }),
    prisma.result.findMany({
      where: { studentId: student.id },
      include: { semester: true },
      orderBy: { semester: { number: 'desc' } },
    }),
    prisma.notification.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.payment.findMany({
      where: { studentId: student.id },
      include: { fee: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  // Calculate attendance percentage
  const totalClasses = attendanceSummary.length;
  const presentClasses = attendanceSummary.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  res.json({
    success: true,
    data: {
      student,
      stats: {
        attendancePercentage,
        totalClasses,
        presentClasses,
        pendingHomeworkCount: pendingHomework.filter(h => h.submissions.length === 0).length,
        pendingAssignmentCount: pendingAssignments.filter(a => a.submissions.length === 0).length,
        cgpa: recentResults[0]?.cgpa || 0,
      },
      pendingHomework,
      pendingAssignments,
      recentResults,
      notifications,
      feeStatus,
    },
  });
}));

export default router;
