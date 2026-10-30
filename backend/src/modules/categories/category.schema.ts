import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters').max(100),
  description: z.string().trim().max(500).optional(),
  bannerUrl: z.string().url('Banner URL must be a valid URL').optional().or(z.literal('')),
  displayOrder: z.number().int().nonnegative().optional().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();
