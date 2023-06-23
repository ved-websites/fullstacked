import { Environment, type EnvironmentConfig } from '$/env.validation';
import type { PrismaClient } from '$prisma-client';
import { luciaCryptoNode18, luciaMiddleware, luciaModule, prismaAdapterModule } from './modules-compat';

export async function luciaFactory(prisma: PrismaClient, env: EnvironmentConfig) {
	await luciaCryptoNode18();

	const { lucia } = await luciaModule();
	const { prisma: prismaAdapter } = await prismaAdapterModule();
	const { express } = await luciaMiddleware();

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
