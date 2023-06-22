import { Environment, type EnvironmentConfig } from '$common/configs/env.validation';
import type { PrismaService } from '$common/prisma/prisma.service';
import { luciaCryptoNode18, luciaMiddleware, luciaModule, prismaAdapterModule } from './modules-compat';

export async function luciaFactory(prisma: PrismaService, env: EnvironmentConfig) {
	await luciaCryptoNode18();

	const { lucia } = await luciaModule();
	const { prisma: prismaAdapter } = await prismaAdapterModule();
	const { express } = await luciaMiddleware();

	return lucia({
		adapter: prismaAdapter(prisma),
		env: env.NODE_ENV == Environment.Development ? 'DEV' : 'PROD',
		middleware: express(),
		sessionCookie: {
			name: 'auth_session',
		},
		getUserAttributes: (dbUser) => {
			return dbUser;
		},
	});
}

export const LuciaFactory = 'AUTH';

export type Auth = Awaited<ReturnType<typeof luciaFactory>>;
