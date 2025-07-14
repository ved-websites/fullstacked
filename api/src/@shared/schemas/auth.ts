import { z } from 'zod/v4';

export const PASSWORD_MIN_LENGTH = 4;

export const passwordSchema = z
	.string({
		error: (issue) => {
			if (issue.input === undefined) {
				return 'common.errors.validation.required' satisfies I18nKey;
			}
		},
	})
	.min(PASSWORD_MIN_LENGTH, 'common.errors.validation.password.minlength' satisfies I18nKey);

export const emailSchema = z.email({
	error: (issue) => {
		if (issue.input === undefined) {
			return 'common.errors.validation.required' satisfies I18nKey;
		}

		return 'common.errors.validation.email-schema' satisfies I18nKey;
	},
});
