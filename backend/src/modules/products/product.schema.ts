import { z } from 'zod';

export const productImageInputSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
  altText: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters').max(200),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5000),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive').optional(),
  currency: z.string().max(10).default('USD').optional(),
  purchaseUrl: z.string().url('Purchase URL must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['published', 'draft', 'archived']).default('published').optional(),
  isFeatured: z.boolean().default(false).optional(),
  images: z
    .array(z.union([z.string(), productImageInputSchema]))
    .optional()
    .default([]),
  // Optional gold shop / craftsmanship attributes
  purity: z.enum(['24K', '22K', '18K', '14K']).default('22K').optional(),
  grossWeight: z.number().positive('Gross weight must be positive').optional(),
  netWeight: z.number().positive('Net weight must be positive').optional(),
  stoneWeight: z.number().nonnegative().default(0).optional(),
  makingCharges: z.number().nonnegative().default(0).optional(),
  estimatedPrice: z.number().positive('Estimated price must be positive').optional(),
  hallmarkCertified: z.boolean().default(true).optional(),
  inStock: z.boolean().default(true).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  purity: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  status: z.enum(['published', 'draft', 'archived', 'all']).optional(),
  isFeatured: z.string().optional(),
  sortBy: z.enum(['featured', 'price_asc', 'price_desc', 'name_asc', 'name_desc', 'weight_desc', 'newest']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryParams = z.infer<typeof productQuerySchema>;
