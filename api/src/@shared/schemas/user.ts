import GeneratedUserSchema from '$zod/modelSchema/UserSchema';
import { z } from 'zod';

export const onlineSchema = z.boolean().nullable();

export const fullNameSchema = z.string().nullable();

export const UserSchema = GeneratedUserSchema.omit({
	hashedPassword: true,
}).extend({
	fullName: fullNameSchema,
});

export const LiveUserSchema = UserSchema.extend({
	online: onlineSchema,
});
