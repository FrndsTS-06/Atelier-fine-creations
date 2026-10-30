import { z } from 'zod';

export const createInquirySchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100).optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address')
      .max(150, 'Email address cannot exceed 150 characters'),
    subject: z
      .string()
      .trim()
      .min(3, 'Subject must be at least 3 characters')
      .max(150, 'Subject cannot exceed 150 characters')
      .optional()
      .or(z.literal('')),
    phone: z.string().trim().max(50, 'Phone number cannot exceed 50 characters').optional().or(z.literal('')),
    preferredKarat: z.string().optional(),
    message: z
      .string()
      .trim()
      .min(10, 'Message must be at least 10 characters')
      .max(2000, 'Message cannot exceed 2,000 characters'),
    productId: z.string().optional(),
  })
  .refine((data) => Boolean(data.name || data.fullName), {
    message: 'Either name or fullName must be provided',
    path: ['name'],
  });

export const updateInquiryStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONTACTED', 'SCHEDULED', 'CLOSED']),
  internalNotes: z.string().max(1000).optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
