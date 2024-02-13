import { getUserFullName } from '$prisma/prisma.extended-client';
import { type PrismaService } from '$prisma/prisma.service';
import { Environment, EnvironmentConfig } from '~env';
import { SESSION_COOKIE_NAME } from '~shared';
import { loadLuciaModule, loadPrismaAdapterModule } from './modules-compat';
import { EnhancedUser } from './types';

export async function luciaFactory(prisma: PrismaService, env: EnvironmentConfig) {
	const { Lucia, TimeSpan } = await loadLuciaModule();
	const { PrismaAdapter } = await loadPrismaAdapterModule();

	const adapter = new PrismaAdapter<PrismaService>(prisma.$rawClient.session, prisma.$rawClient.user);

	const sessionExpirationInWeeks = 8; // 2 months

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

export const LuciaFactory = 'AUTH';

export type Auth = Awaited<ReturnType<typeof luciaFactory>>;
