import { Router } from 'express';
import { createCrudService } from '../services/crud.service';
import { createCrudController } from '../controllers/crud.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { collegeSchema } from '@college-erp/shared';
import { UserRole } from '@prisma/client';

const router = Router();

const collegeService = createCrudService('college', {
  searchFields: ['name', 'code', 'city', 'state'],
  cachePrefix: 'colleges',
});

const controller = createCrudController(collegeService);

router.use(authenticate);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authorize(UserRole.SUPER_ADMIN), validate(collegeSchema), controller.create);
router.put('/:id', authorize(UserRole.SUPER_ADMIN), validate(collegeSchema), controller.update);
router.patch('/:id/deactivate', authorize(UserRole.SUPER_ADMIN), controller.softDelete);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), controller.delete);

export default router;
