import { z } from 'zod';
import type { I18nKey } from '~shared';

export const chatSchema = z.object({
	message: z.string().min(1, 'chat.errors.message.empty' satisfies I18nKey),
});
