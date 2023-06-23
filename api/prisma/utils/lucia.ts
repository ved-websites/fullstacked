import 'lucia/polyfill/node';

import type { PrismaClient } from '$prisma-client';
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { lucia } from 'lucia';

export function getAuth(prisma: PrismaClient) {
	return lucia({
		adapter: prismaAdapter(prisma),
		env: 'DEV',
		getUserAttributes: (dbUser) => {
			return {
				id: dbUser.userId,
				email: dbUser.email,
			} satisfies LuciaUser;
		},
	});
}

export type LuciaUser = {
	id: string;
	email: string;
};
