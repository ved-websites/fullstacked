import { getUserFullName } from '$prisma/prisma.extended-client';
import { type PrismaService } from '$prisma/prisma.service';
import type { Response } from 'express';
import type { Cookie } from 'lucia';
import { Environment, EnvironmentConfig } from '~env';
import { SESSION_COOKIE_NAME } from '~shared';
import { loadLuciaModule, loadPrismaAdapterModule } from './modules-compat';
import { EnhancedUser } from './types';

const sessionExpirationInWeeks = 8; // 2 months

export async function luciaFactory(prisma: PrismaService, env: EnvironmentConfig) {
	const { Lucia, TimeSpan } = await loadLuciaModule();
	const { PrismaAdapter } = await loadPrismaAdapterModule();

	const adapter = new PrismaAdapter<PrismaService>(prisma.$rawClient.session, prisma.$rawClient.user);

	return new Lucia(adapter, {
		getUserAttributes: (dbUserAttributes) => {
			dbUserAttributes.hashedPassword = null;

			(dbUserAttributes as Record<string, unknown>)['fullName'] = getUserFullName(dbUserAttributes);

			return dbUserAttributes as EnhancedUser;
		},
		sessionExpiresIn: new TimeSpan(sessionExpirationInWeeks, 'w'),
		sessionCookie: {
			name: SESSION_COOKIE_NAME,
			attributes: {
				secure: env.NODE_ENV == Environment.Production,
			},
		},
	});
}

/**
 * Sets the Oslo cookie to the express response's compatible cookie.
 */
export function setResponseCookie(response: Response, cookie: Cookie) {
	// Max-Age in Oslo Cookie is `seconds`, while it is `milliseconds` in `response.cookie`
	const maxAge = (cookie.attributes.maxAge ?? 1000) * 1000;

	response.cookie(cookie.name, cookie.value, {
		...cookie.attributes,
		maxAge,
	});
}

export const LuciaFactory = 'AUTH';

export type Auth = Awaited<ReturnType<typeof luciaFactory>>;
