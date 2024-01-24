import { z } from 'zod';

export const firstNameSchema = z.nullable(z.string());
export const lastNameSchema = z.nullable(z.string());
