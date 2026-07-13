import { Router } from 'express';
import { createCrudService } from '../services/crud.service';
import { createCrudController } from '../controllers/crud.controller';
import { authenticate, authorize, isTeacherOrAbove } from '../middleware/auth';
import { UserRole } from '@prisma/client';

// ============================================
// Library Routes
// ============================================
const libraryRouter = Router();

const bookService = createCrudService('book', {
  searchFields: ['title', 'author', 'isbn', 'category'],
  cachePrefix: 'books',
});
const bookController = createCrudController(bookService);

const bookIssueService = createCrudService('bookIssue', {
  defaultInclude: {
    book: true,
    student: { include: { user: { select: { firstName: true, lastName: true } } } },
  },
  cachePrefix: 'bookIssues',
});
const bookIssueController = createCrudController(bookIssueService);

libraryRouter.use(authenticate);
libraryRouter.get('/books', bookController.getAll);
libraryRouter.get('/books/:id', bookController.getById);
libraryRouter.post('/books', authorize(UserRole.SUPER_ADMIN, UserRole.LIBRARIAN), bookController.create);
libraryRouter.put('/books/:id', authorize(UserRole.SUPER_ADMIN, UserRole.LIBRARIAN), bookController.update);
libraryRouter.delete('/books/:id', authorize(UserRole.SUPER_ADMIN, UserRole.LIBRARIAN), bookController.delete);
libraryRouter.get('/issues', bookIssueController.getAll);
libraryRouter.post('/issues', authorize(UserRole.SUPER_ADMIN, UserRole.LIBRARIAN), bookIssueController.create);
libraryRouter.put('/issues/:id', authorize(UserRole.SUPER_ADMIN, UserRole.LIBRARIAN), bookIssueController.update);

// ============================================
// Hostel Routes
// ============================================
const hostelRouter = Router();

const hostelService = createCrudService('hostel', {
  searchFields: ['name'],
  defaultInclude: { rooms: true },
  cachePrefix: 'hostels',
});
const hostelController = createCrudController(hostelService);

const roomService = createCrudService('room', {
  searchFields: ['number'],
  defaultInclude: {
    hostel: true,
    allocations: { include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } } },
  },
  cachePrefix: 'rooms',
});
const roomController = createCrudController(roomService);

hostelRouter.use(authenticate);
hostelRouter.get('/', hostelController.getAll);
hostelRouter.get('/:id', hostelController.getById);
hostelRouter.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.HOSTEL_WARDEN), hostelController.create);
hostelRouter.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.HOSTEL_WARDEN), hostelController.update);
hostelRouter.delete('/:id', authorize(UserRole.SUPER_ADMIN), hostelController.delete);
hostelRouter.get('/:hostelId/rooms', roomController.getAll);
hostelRouter.post('/rooms', authorize(UserRole.SUPER_ADMIN, UserRole.HOSTEL_WARDEN), roomController.create);
hostelRouter.put('/rooms/:id', authorize(UserRole.SUPER_ADMIN, UserRole.HOSTEL_WARDEN), roomController.update);

// ============================================
// Transport Routes
// ============================================
const transportRouter = Router();

const busService = createCrudService('bus', {
  searchFields: ['number', 'registrationNo'],
  defaultInclude: { routes: true },
  cachePrefix: 'buses',
});
const busController = createCrudController(busService);

const routeService = createCrudService('busRoute', {
  searchFields: ['name'],
  defaultInclude: { bus: true, driver: true },
  cachePrefix: 'busRoutes',
});
const routeController = createCrudController(routeService);

transportRouter.use(authenticate);
transportRouter.get('/buses', busController.getAll);
transportRouter.get('/buses/:id', busController.getById);
transportRouter.post('/buses', authorize(UserRole.SUPER_ADMIN, UserRole.TRANSPORT_MANAGER), busController.create);
transportRouter.put('/buses/:id', authorize(UserRole.SUPER_ADMIN, UserRole.TRANSPORT_MANAGER), busController.update);
transportRouter.delete('/buses/:id', authorize(UserRole.SUPER_ADMIN), busController.delete);
transportRouter.get('/routes', routeController.getAll);
transportRouter.get('/routes/:id', routeController.getById);
transportRouter.post('/routes', authorize(UserRole.SUPER_ADMIN, UserRole.TRANSPORT_MANAGER), routeController.create);
transportRouter.put('/routes/:id', authorize(UserRole.SUPER_ADMIN, UserRole.TRANSPORT_MANAGER), routeController.update);
transportRouter.delete('/routes/:id', authorize(UserRole.SUPER_ADMIN), routeController.delete);

// ============================================
// Placement Routes
// ============================================
const placementRouter = Router();

const companyService = createCrudService('company', {
  searchFields: ['name', 'industry'],
  cachePrefix: 'companies',
});
const companyController = createCrudController(companyService);

const driveService = createCrudService('placementDrive', {
  searchFields: ['title'],
  defaultInclude: { company: true },
  cachePrefix: 'placementDrives',
});
const driveController = createCrudController(driveService);

placementRouter.use(authenticate);
placementRouter.get('/companies', companyController.getAll);
placementRouter.get('/companies/:id', companyController.getById);
placementRouter.post('/companies', authorize(UserRole.SUPER_ADMIN, UserRole.PLACEMENT_OFFICER), companyController.create);
placementRouter.put('/companies/:id', authorize(UserRole.SUPER_ADMIN, UserRole.PLACEMENT_OFFICER), companyController.update);
placementRouter.delete('/companies/:id', authorize(UserRole.SUPER_ADMIN), companyController.delete);
placementRouter.get('/drives', driveController.getAll);
placementRouter.get('/drives/:id', driveController.getById);
placementRouter.post('/drives', authorize(UserRole.SUPER_ADMIN, UserRole.PLACEMENT_OFFICER), driveController.create);
placementRouter.put('/drives/:id', authorize(UserRole.SUPER_ADMIN, UserRole.PLACEMENT_OFFICER), driveController.update);
placementRouter.delete('/drives/:id', authorize(UserRole.SUPER_ADMIN), driveController.delete);

export { libraryRouter, hostelRouter, transportRouter, placementRouter };
