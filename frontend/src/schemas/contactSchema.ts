import { z } from 'zod';

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name cannot exceed 100 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.')
    .max(150, 'Email address cannot exceed 150 characters.'),
  subject: z
    .string()
    .trim()
    .min(1, 'Subject is required.')
    .min(3, 'Subject must be at least 3 characters.')
    .max(150, 'Subject cannot exceed 150 characters.'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required.')
    .min(10, 'Message must be at least 10 characters.')
    .max(2000, 'Message cannot exceed 2,000 characters.'),
  phone: z
    .string()
    .trim()
    .max(50, 'Phone number cannot exceed 50 characters.')
    .optional()
    .or(z.literal('')),
  preferredKarat: z.string().optional(),
  productId: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
