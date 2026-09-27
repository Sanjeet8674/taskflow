import { z } from 'zod';
import { TASK_STATUSES } from '../models/Task.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(72),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(5000).optional().default(''),
    status: z.enum(TASK_STATUSES).optional().default('pending'),
    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate must be YYYY-MM-DD'),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).max(200).optional(),
      description: z.string().trim().max(5000).optional(),
      status: z.enum(TASK_STATUSES).optional(),
      dueDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate must be YYYY-MM-DD')
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided',
    }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const listTasksSchema = z.object({
  query: z.object({
    status: z.enum(TASK_STATUSES).optional(),
  }),
});
