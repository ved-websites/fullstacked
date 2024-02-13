import { z } from 'zod';
import { k } from '../utils/i18n';

export const PASSWORD_MIN_LENGTH = 4;

export const passwordSchema = z
	.string({ required_error: k('common.errors.validation.required') })
	.min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} chars!`); // TODO : i18n

export const emailSchema = z
	.string({ required_error: k('common.errors.validation.required') })
	.email(k('common.errors.validation.email-schema'));