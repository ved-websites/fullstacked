import { z } from 'zod/v4';

export const chatSchema = z.object({
	message: z.string().min(1, 'chat.errors.message.empty' satisfies I18nKey),
});
