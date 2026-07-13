import { Router } from 'express';
import { createCrudService } from '../services/crud.service';
import { createCrudController } from '../controllers/crud.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { departmentSchema } from '@college-erp/shared';
import { UserRole } from '@prisma/client';

const router = Router();

const departmentService = createCrudService('department', {
  searchFields: ['name', 'code'],
  defaultInclude: { college: true, hod: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } },
  cachePrefix: 'departments',
});

const controller = createCrudController(departmentService);

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL), validate(departmentSchema), controller.create);
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL), validate(departmentSchema), controller.update);
router.patch('/:id/deactivate', authorize(UserRole.SUPER_ADMIN, UserRole.PRINCIPAL), controller.softDelete);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), controller.delete);

export default router;
