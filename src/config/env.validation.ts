import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'La variable DATABASE_URL es obligatoria para Prisma.',
  }),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),

  RESEND_API_KEY: Joi.string().required().messages({
    'any.required': 'No podés mandar mails sin la RESEND_API_KEY.',
  }),

  ADMIN_USER: Joi.string().default('admin'),
  ADMIN_PASS: Joi.string().default('admin123'),
});