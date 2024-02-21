import { z } from 'zod';
import { k } from '~shared';

export const chatSchema = z.object({
	message: z.string().min(1, k('chat.errors.message.empty')),
});
