import { Router } from 'express';
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { createCrudService } from '../services/crud.service';
import { createCrudController } from '../controllers/crud.controller';
import { authenticate, authorize } from '../middleware/auth';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

// ============================================
// Student Routes
// ============================================
const studentRouter = Router();

const studentService = createCrudService('student', {
  searchFields: ['enrollmentNo'],
  defaultInclude: {
    user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatar: true, gender: true } },
    course: true,
    branch: true,
    section: true,
    semester: true,
  },
  cachePrefix: 'students',
});

const studentController = createCrudController(studentService);

studentRouter.use(authenticate);
studentRouter.get('/', studentController.getAll);
studentRouter.get('/:id', studentController.getById);

// Create student (creates user + student profile)
studentRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL), asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, gender, dateOfBirth, address,
    enrollmentNo, courseId, branchId, sectionId, semesterId, batchYear, admissionDate } = req.body;

  const bcrypt = require('bcryptjs');
  const defaultPassword = await bcrypt.hash('Student@123', 12);

  const student = await prisma.student.create({
    data: {
      enrollmentNo,
      courseId,
      branchId,
      sectionId,
      semesterId,
      batchYear,
      admissionDate: new Date(admissionDate),
      user: {
        create: {
          firstName,
          lastName,
          email,
          password: defaultPassword,
          phone,
          gender,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          address,
          role: UserRole.STUDENT,
        },
      },
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      course: true,
      branch: true,
      semester: true,
    },
  });

  res.status(201).json({ success: true, message: 'Student created', data: student });
}));

studentRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.HOD), asyncHandler(async (req: Request, res: Response) => {
  const student = await prisma.student.update({
    where: { id: req.params.id },
    data: req.body,
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      course: true,
    },
  });
  res.json({ success: true, data: student });
}));

studentRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  await prisma.student.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Student deleted' });
}));

// ============================================
// Teacher Routes
// ============================================
const teacherRouter = Router();

const teacherService = createCrudService('teacher', {
  searchFields: ['employeeId', 'designation', 'specialization'],
  defaultInclude: {
    user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatar: true } },
    department: true,
  },
  cachePrefix: 'teachers',
});

const teacherController = createCrudController(teacherService);

teacherRouter.use(authenticate);
teacherRouter.get('/', teacherController.getAll);
teacherRouter.get('/:id', teacherController.getById);

teacherRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL), asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone,
    employeeId, departmentId, designation, qualification, specialization, joiningDate } = req.body;

  const bcrypt = require('bcryptjs');
  const defaultPassword = await bcrypt.hash('Teacher@123', 12);

  const teacher = await prisma.teacher.create({
    data: {
      employeeId,
      designation,
      qualification,
      specialization,
      joiningDate: new Date(joiningDate),
      department: {
        connect: { id: departmentId },
      },
      user: {
        create: {
          firstName,
          lastName,
          email,
          password: defaultPassword,
          phone,
          role: UserRole.TEACHER,
        },
      },
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      department: true,
    },
  });

  res.status(201).json({ success: true, message: 'Teacher created', data: teacher });
}));

teacherRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.HOD), asyncHandler(async (req: Request, res: Response) => {
  const teacher = await prisma.teacher.update({
    where: { id: req.params.id },
    data: req.body,
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      department: true,
    },
  });
  res.json({ success: true, data: teacher });
}));

teacherRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), asyncHandler(async (req: Request, res: Response) => {
  await prisma.teacher.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Teacher deleted' });
}));

export { studentRouter, teacherRouter };
