import RoleSchema from '$zod/modelSchema/RoleSchema';
import GeneratedUserSchema from '$zod/modelSchema/UserSchema';
import { z } from 'zod/v4';

export const onlineSchema = z.boolean().nullable();

export const fullNameSchema = z.string().nullable();

export const UserSchema = GeneratedUserSchema.omit({
	hashedPassword: true,
}).extend({
	fullName: fullNameSchema,
});

export const UserRolesSchemaExtension = {
	roles: RoleSchema.omit({ createdAt: true }).array(),
};

export const LiveUserSchema = UserSchema.extend({
	online: onlineSchema,
});
