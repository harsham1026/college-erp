import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Generic CRUD controller factory.
 * Creates standard CRUD endpoints for any service.
 */
export function createCrudController(service: any) {
  return {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const { page, limit, sortBy, sortOrder, search, ...filters } = req.query as any;
      const result = await service.findAll(
        { page: Number(page), limit: Number(limit), sortBy, sortOrder, search },
        filters,
      );
      res.json({ success: true, ...result });
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
      const record = await service.findById(req.params.id);
      res.json({ success: true, data: record });
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      const record = await service.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Created successfully',
        data: record,
      });
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const record = await service.update(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Updated successfully',
        data: record,
      });
    }),

    delete: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.delete(req.params.id);
      res.json({ success: true, ...result });
    }),

    softDelete: asyncHandler(async (req: Request, res: Response) => {
      const result = await service.softDelete(req.params.id);
      res.json({
        success: true,
        message: 'Deactivated successfully',
        data: result,
      });
    }),
  };
}
