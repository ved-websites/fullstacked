import { Environment, type EnvironmentConfig } from '$common/configs/env.validation';
import type { PrismaService } from '$common/prisma/prisma.service';
import { luciaMiddleware, luciaModule, prismaAdapterModule } from './modules-compat';

export async function luciaFactory(prisma: PrismaService, env: EnvironmentConfig) {
	const lucia = await luciaModule();
	const prismaAdapter = await prismaAdapterModule();
	const { express } = await luciaMiddleware();

	return lucia({
		adapter: prismaAdapter(prisma),
		env: env.NODE_ENV == Environment.Development ? 'DEV' : 'PROD',
		middleware: express(),
	});
}

export type Auth = Awaited<ReturnType<typeof luciaFactory>>;
