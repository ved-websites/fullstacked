import { z } from 'zod';

export const schema = z.object({
	message: z.string().min(1, 'You cannot send empty messages!'),
});
