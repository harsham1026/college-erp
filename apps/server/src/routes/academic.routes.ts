import { Router } from 'express';
import { createCrudService } from '../services/crud.service';
import { createCrudController } from '../controllers/crud.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { courseSchema, subjectSchema } from '@college-erp/shared';
import { UserRole } from '@prisma/client';

// ============================================
// Courses
// ============================================
const courseRouter = Router();

const courseService = createCrudService('course', {
  searchFields: ['name', 'code'],
  defaultInclude: { department: true },
  cachePrefix: 'courses',
});

const courseController = createCrudController(courseService);

courseRouter.use(authenticate);
courseRouter.get('/', courseController.getAll);
courseRouter.get('/:id', courseController.getById);
courseRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL), validate(courseSchema), courseController.create);
courseRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL), validate(courseSchema), courseController.update);
courseRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), courseController.delete);

// ============================================
// Subjects
// ============================================
const subjectRouter = Router();

const subjectService = createCrudService('subject', {
  searchFields: ['name', 'code'],
  defaultInclude: { course: true, semester: true, teachers: { include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } } },
  cachePrefix: 'subjects',
});

const subjectController = createCrudController(subjectService);

subjectRouter.use(authenticate);
subjectRouter.get('/', subjectController.getAll);
subjectRouter.get('/:id', subjectController.getById);
subjectRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.HOD), validate(subjectSchema), subjectController.create);
subjectRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.HOD), validate(subjectSchema), subjectController.update);
subjectRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), subjectController.delete);

export { courseRouter, subjectRouter };
