import { z } from 'zod';

const clientEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().default('http://localhost:5000/api/v1'),
  VITE_ENABLE_MOCK_FALLBACK: z.string().default('true'),
});

const parsed = clientEnvSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_ENABLE_MOCK_FALLBACK: import.meta.env.VITE_ENABLE_MOCK_FALLBACK,
});

export const CLIENT_ENV = parsed.success ? parsed.data : {
  VITE_API_BASE_URL: 'http://localhost:5000/api/v1',
  VITE_ENABLE_MOCK_FALLBACK: 'true',
};
