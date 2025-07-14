import { z } from 'zod/v4';

export const firstNameSchema = z.nullable(z.string());
export const lastNameSchema = z.nullable(z.string());
