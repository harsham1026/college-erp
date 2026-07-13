import { Router } from 'express';
import authRoutes from './auth.routes';
import collegeRoutes from './college.routes';
import departmentRoutes from './department.routes';
import { courseRouter, subjectRouter } from './academic.routes';
import { studentRouter, teacherRouter } from './people.routes';
import attendanceRoutes from './attendance.routes';
import { feeRouter, paymentRouter } from './finance.routes';
import { libraryRouter, hostelRouter, transportRouter, placementRouter } from './modules.routes';
import dashboardRoutes from './dashboard.routes';
import { createCrudService } from '../services/crud.service';
import { createCrudController } from '../controllers/crud.controller';
import { authenticate, authorize, isTeacherOrAbove } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// ============================================
// Core Routes
// ============================================
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

// ============================================
// Academic Structure
// ============================================
router.use('/colleges', collegeRoutes);
router.use('/departments', departmentRoutes);
router.use('/courses', courseRouter);
router.use('/subjects', subjectRouter);

// ============================================
// People
// ============================================
router.use('/students', studentRouter);
router.use('/teachers', teacherRouter);

// ============================================
// Academics
// ============================================
router.use('/attendance', attendanceRoutes);

// Quick CRUD routes for remaining models
const semesterService = createCrudService('semester', { searchFields: ['name'], cachePrefix: 'semesters', defaultInclude: { course: true } });
const semesterController = createCrudController(semesterService);
const semesterRouter = Router();
semesterRouter.use(authenticate);
semesterRouter.get('/', semesterController.getAll);
semesterRouter.get('/:id', semesterController.getById);
semesterRouter.post('/', authorize(UserRole.SUPER_ADMIN), semesterController.create);
semesterRouter.put('/:id', authorize(UserRole.SUPER_ADMIN), semesterController.update);
semesterRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), semesterController.delete);
router.use('/semesters', semesterRouter);

const branchService = createCrudService('branch', { searchFields: ['name', 'code'], cachePrefix: 'branches', defaultInclude: { course: true } });
const branchController = createCrudController(branchService);
const branchRouter = Router();
branchRouter.use(authenticate);
branchRouter.get('/', branchController.getAll);
branchRouter.get('/:id', branchController.getById);
branchRouter.post('/', authorize(UserRole.SUPER_ADMIN), branchController.create);
branchRouter.put('/:id', authorize(UserRole.SUPER_ADMIN), branchController.update);
branchRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), branchController.delete);
router.use('/branches', branchRouter);

const sectionService = createCrudService('section', { searchFields: ['name'], cachePrefix: 'sections', defaultInclude: { branch: true } });
const sectionController = createCrudController(sectionService);
const sectionRouter = Router();
sectionRouter.use(authenticate);
sectionRouter.get('/', sectionController.getAll);
sectionRouter.get('/:id', sectionController.getById);
sectionRouter.post('/', authorize(UserRole.SUPER_ADMIN), sectionController.create);
sectionRouter.put('/:id', authorize(UserRole.SUPER_ADMIN), sectionController.update);
sectionRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), sectionController.delete);
router.use('/sections', sectionRouter);

// Homework CRUD
const homeworkService = createCrudService('homework', { searchFields: ['title'], cachePrefix: 'homework', defaultInclude: { subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } });
const homeworkController = createCrudController(homeworkService);
const homeworkRouter = Router();
homeworkRouter.use(authenticate);
homeworkRouter.get('/', homeworkController.getAll);
homeworkRouter.get('/:id', homeworkController.getById);
homeworkRouter.post('/', isTeacherOrAbove, homeworkController.create);
homeworkRouter.put('/:id', isTeacherOrAbove, homeworkController.update);
homeworkRouter.delete('/:id', isTeacherOrAbove, homeworkController.delete);
router.use('/homework', homeworkRouter);

// Assignment CRUD
const assignmentService = createCrudService('assignment', { searchFields: ['title'], cachePrefix: 'assignments', defaultInclude: { subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } });
const assignmentController = createCrudController(assignmentService);
const assignmentRouter = Router();
assignmentRouter.use(authenticate);
assignmentRouter.get('/', assignmentController.getAll);
assignmentRouter.get('/:id', assignmentController.getById);
assignmentRouter.post('/', isTeacherOrAbove, assignmentController.create);
assignmentRouter.put('/:id', isTeacherOrAbove, assignmentController.update);
assignmentRouter.delete('/:id', isTeacherOrAbove, assignmentController.delete);
router.use('/assignments', assignmentRouter);

// Exam CRUD
const examService = createCrudService('exam', { searchFields: ['name'], cachePrefix: 'exams', defaultInclude: { subject: true, semester: true } });
const examController = createCrudController(examService);
const examRouter = Router();
examRouter.use(authenticate);
examRouter.get('/', examController.getAll);
examRouter.get('/:id', examController.getById);
examRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.EXAM_CONTROLLER), examController.create);
examRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.EXAM_CONTROLLER), examController.update);
examRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), examController.delete);
router.use('/exams', examRouter);

// Timetable CRUD
const timetableService = createCrudService('timetableSlot', { cachePrefix: 'timetable', defaultInclude: { section: true, subject: true, teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } });
const timetableController = createCrudController(timetableService);
const timetableRouter = Router();
timetableRouter.use(authenticate);
timetableRouter.get('/', timetableController.getAll);
timetableRouter.get('/:id', timetableController.getById);
timetableRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.HOD), timetableController.create);
timetableRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.HOD), timetableController.update);
timetableRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), timetableController.delete);
router.use('/timetable', timetableRouter);

// Announcement CRUD
const announcementService = createCrudService('announcement', { searchFields: ['title', 'content'], cachePrefix: 'announcements' });
const announcementController = createCrudController(announcementService);
const announcementRouter = Router();
announcementRouter.use(authenticate);
announcementRouter.get('/', announcementController.getAll);
announcementRouter.get('/:id', announcementController.getById);
announcementRouter.post('/', isTeacherOrAbove, announcementController.create);
announcementRouter.put('/:id', isTeacherOrAbove, announcementController.update);
announcementRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), announcementController.delete);
router.use('/announcements', announcementRouter);

// Notification CRUD
const notificationService = createCrudService('notification', { cachePrefix: 'notifications' });
const notificationController = createCrudController(notificationService);
const notificationRouter = Router();
notificationRouter.use(authenticate);
notificationRouter.get('/', notificationController.getAll);
notificationRouter.put('/:id', notificationController.update);
notificationRouter.delete('/:id', notificationController.delete);
router.use('/notifications', notificationRouter);

// Event CRUD
const eventService = createCrudService('event', { searchFields: ['title', 'category'], cachePrefix: 'events' });
const eventController = createCrudController(eventService);
const eventRouter = Router();
eventRouter.use(authenticate);
eventRouter.get('/', eventController.getAll);
eventRouter.get('/:id', eventController.getById);
eventRouter.post('/', isTeacherOrAbove, eventController.create);
eventRouter.put('/:id', isTeacherOrAbove, eventController.update);
eventRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), eventController.delete);
router.use('/events', eventRouter);

// Club CRUD
const clubService = createCrudService('club', { searchFields: ['name', 'category'], cachePrefix: 'clubs' });
const clubController = createCrudController(clubService);
const clubRouter = Router();
clubRouter.use(authenticate);
clubRouter.get('/', clubController.getAll);
clubRouter.get('/:id', clubController.getById);
clubRouter.post('/', isTeacherOrAbove, clubController.create);
clubRouter.put('/:id', isTeacherOrAbove, clubController.update);
clubRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), clubController.delete);
router.use('/clubs', clubRouter);

// Question Bank CRUD
const qbService = createCrudService('questionBank', { searchFields: ['question'], cachePrefix: 'questionBank', defaultInclude: { subject: true } });
const qbController = createCrudController(qbService);
const qbRouter = Router();
qbRouter.use(authenticate);
qbRouter.get('/', qbController.getAll);
qbRouter.get('/:id', qbController.getById);
qbRouter.post('/', isTeacherOrAbove, qbController.create);
qbRouter.put('/:id', isTeacherOrAbove, qbController.update);
qbRouter.delete('/:id', isTeacherOrAbove, qbController.delete);
router.use('/question-bank', qbRouter);

// Audit Logs (read-only)
const auditService = createCrudService('auditLog', { cachePrefix: 'audit' });
const auditController = createCrudController(auditService);
const auditRouter = Router();
auditRouter.use(authenticate, authorize(UserRole.SUPER_ADMIN));
auditRouter.get('/', auditController.getAll);
auditRouter.get('/:id', auditController.getById);
router.use('/audit-logs', auditRouter);

// ============================================
// Module Routes
// ============================================
router.use('/fees', feeRouter);
router.use('/payments', paymentRouter);
router.use('/library', libraryRouter);
router.use('/hostel', hostelRouter);
router.use('/transport', transportRouter);
router.use('/placement', placementRouter);

export default router;
