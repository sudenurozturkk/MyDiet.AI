import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  CORS_ORIGINS: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
})

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  SENTRY_DSN: process.env.SENTRY_DSN,
})


