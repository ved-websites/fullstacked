import { Environment, type EnvironmentConfig } from '$/env.validation';
import { loadLuciaCryptoNode18, loadLuciaMiddleware, loadLuciaModule, loadPrismaAdapterModule } from '$auth/lucia/modules-compat';
import type { PrismaClient } from '$prisma-client';

export async function luciaFactory(prisma: PrismaClient, env: EnvironmentConfig) {
	await loadLuciaCryptoNode18();

	const { lucia } = await loadLuciaModule();
	const { prisma: prismaAdapter } = await loadPrismaAdapterModule();
	const { express } = await loadLuciaMiddleware();

	return lucia({
		adapter: prismaAdapter(prisma),
		env: env.NODE_ENV == Environment.Development ? 'DEV' : 'PROD',
		middleware: express(),
		getUserAttributes: (dbUser) => {
			return dbUser;
		},
	});
}

export const LuciaFactory = 'AUTH';

export type Auth = Awaited<ReturnType<typeof luciaFactory>>;
