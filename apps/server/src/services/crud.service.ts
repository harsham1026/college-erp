import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { cacheGet, cacheSet, cacheDelPattern } from '../config/redis';
import { AppError } from '../middleware/errorHandler';

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Generic CRUD service factory for any Prisma model.
 * Provides pagination, filtering, searching, sorting, and caching.
 */
export function createCrudService<
  TModel extends string,
  TCreateInput,
  TUpdateInput,
>(
  modelName: TModel,
  options?: {
    searchFields?: string[];
    defaultInclude?: Record<string, boolean | object>;
    cachePrefix?: string;
    cacheTtl?: number;
  },
) {
  const model = (prisma as any)[modelName];
  const cachePrefix = options?.cachePrefix || modelName;
  const cacheTtl = options?.cacheTtl || 3600;

  if (!model) {
    throw new Error(`Model "${modelName}" not found in Prisma client`);
  }

  return {
    // ============================================
    // Find All with Pagination
    // ============================================
    async findAll(
      pagination: PaginationOptions = {},
      filters: Record<string, any> = {},
      include?: Record<string, boolean | object>,
    ): Promise<PaginatedResult<any>> {
      const page = Math.max(1, pagination.page || 1);
      const limit = Math.min(100, Math.max(1, pagination.limit || 10));
      const skip = (page - 1) * limit;
      const sortBy = pagination.sortBy || 'createdAt';
      const sortOrder = pagination.sortOrder || 'desc';
      const search = pagination.search;

      // Build where clause
      const where: any = { ...filters };

      // Add search functionality
      if (search && options?.searchFields?.length) {
        where.OR = options.searchFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        }));
      }

      // Check cache
      const cacheKey = `${cachePrefix}:list:${JSON.stringify({ page, limit, sortBy, sortOrder, where })}`;
      const cached = await cacheGet<PaginatedResult<any>>(cacheKey);
      if (cached) return cached;

      const [data, total] = await Promise.all([
        model.findMany({
          where,
          include: include || options?.defaultInclude,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
        }),
        model.count({ where }),
      ]);

      const result: PaginatedResult<any> = {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };

      await cacheSet(cacheKey, result, cacheTtl);
      return result;
    },

    // ============================================
    // Find by ID
    // ============================================
    async findById(id: string, include?: Record<string, boolean | object>) {
      const cacheKey = `${cachePrefix}:${id}`;
      const cached = await cacheGet(cacheKey);
      if (cached) return cached;

      const record = await model.findUnique({
        where: { id },
        include: include || options?.defaultInclude,
      });

      if (!record) {
        throw new AppError(`${modelName} not found`, 404);
      }

      await cacheSet(cacheKey, record, cacheTtl);
      return record;
    },

    // ============================================
    // Create
    // ============================================
    async create(data: TCreateInput, include?: Record<string, boolean | object>) {
      const record = await model.create({
        data: data as any,
        include: include || options?.defaultInclude,
      });

      await cacheDelPattern(`${cachePrefix}:*`);
      return record;
    },

    // ============================================
    // Update
    // ============================================
    async update(id: string, data: TUpdateInput, include?: Record<string, boolean | object>) {
      const existing = await model.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(`${modelName} not found`, 404);
      }

      const record = await model.update({
        where: { id },
        data: data as any,
        include: include || options?.defaultInclude,
      });

      await cacheDelPattern(`${cachePrefix}:*`);
      return record;
    },

    // ============================================
    // Delete
    // ============================================
    async delete(id: string) {
      const existing = await model.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(`${modelName} not found`, 404);
      }

      await model.delete({ where: { id } });
      await cacheDelPattern(`${cachePrefix}:*`);
      return { message: `${modelName} deleted successfully` };
    },

    // ============================================
    // Soft Delete (set isActive = false)
    // ============================================
    async softDelete(id: string) {
      const existing = await model.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(`${modelName} not found`, 404);
      }

      const record = await model.update({
        where: { id },
        data: { isActive: false },
      });

      await cacheDelPattern(`${cachePrefix}:*`);
      return record;
    },

    // ============================================
    // Count
    // ============================================
    async count(filters: Record<string, any> = {}) {
      return model.count({ where: filters });
    },

    // ============================================
    // Bulk Create
    // ============================================
    async createMany(data: TCreateInput[]) {
      const result = await model.createMany({
        data: data as any,
        skipDuplicates: true,
      });
      await cacheDelPattern(`${cachePrefix}:*`);
      return result;
    },
  };
}
