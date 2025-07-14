import { z } from 'zod/v4';
import { emailSchema, passwordSchema } from '~shared';

export const requestPasswordSchema = z.object({
	email: emailSchema,
});

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	resetToken: z.string({
		error: (issue) => {
			if (issue.input === undefined) {
				return '(auth).forgot-password.reset.action.no-token' satisfies I18nKey;
			}
		},
	}),
});
