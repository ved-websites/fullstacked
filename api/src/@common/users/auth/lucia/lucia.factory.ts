import type { PrismaClient, User } from '$prisma-client';
import { loadLuciaCryptoNode18, loadLuciaMiddleware, loadLuciaModule, loadPrismaAdapterModule } from '$users/auth/lucia/modules-compat';
import { Environment, type EnvironmentConfig } from '~/env.validation';

export async function luciaFactory(prisma: PrismaClient, env: EnvironmentConfig) {
	await loadLuciaCryptoNode18();

	const { lucia } = await loadLuciaModule();
	const { prisma: prismaAdapter } = await loadPrismaAdapterModule();
	const { express } = await loadLuciaMiddleware();

	const isDev = env.NODE_ENV == Environment.Development;

	return lucia({
		adapter: prismaAdapter(prisma),
		env: isDev ? 'DEV' : 'PROD',
		middleware: express(),
		getUserAttributes: (userSchema) => {
			const dbUser = userSchema as User;

			return {
				fullName: userSchema.firstName && userSchema.lastName ? `${userSchema.firstName} ${userSchema.lastName}` : undefined,
				...dbUser,
			};
		},
		allowedRequestOrigins: env.CORS_LINKS,
	});
}

export const LuciaFactory = 'AUTH';

export type Auth = Awaited<ReturnType<typeof luciaFactory>>;
