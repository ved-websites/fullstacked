import { k } from '$i18n';
import { z } from 'zod';

export const schema = z.object({
	message: z.string().min(1, k('chat.errors.message.empty')),
});
