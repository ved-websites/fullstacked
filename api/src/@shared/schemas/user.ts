import UserSchema from '$zod/modelSchema/UserSchema';
import { z } from 'zod';

export const onlineSchema = z.boolean().nullable();

export const LiveUserSchema = UserSchema.extend({
	online: onlineSchema,
});
