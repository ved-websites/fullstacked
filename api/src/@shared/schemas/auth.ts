import { z } from 'zod';
import type { I18nKey } from '../utils/i18n';

export const PASSWORD_MIN_LENGTH = 4;

export const passwordSchema = z
	.string({ required_error: 'common.errors.validation.required' satisfies I18nKey })
	.min(PASSWORD_MIN_LENGTH, 'common.errors.validation.password.minlength' satisfies I18nKey);

export const emailSchema = z
	.string({ required_error: 'common.errors.validation.required' satisfies I18nKey })
	.email('common.errors.validation.email-schema' satisfies I18nKey);
