import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 4;

export const passwordSchema = z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} chars!`);

export const emailSchema = z.string().email();

export const firstNameSchema = z.nullable(z.string());
export const lastNameSchema = z.nullable(z.string());