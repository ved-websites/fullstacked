const importDynamic = new Function('modulePath', 'return import(modulePath)');

export async function loadLuciaModule() {
	const module = importDynamic('lucia') as Promise<typeof import('lucia')>;

	return module;
}
export async function loadLuciaUtils() {
	const module = importDynamic('lucia/utils') as Promise<typeof import('lucia/utils')>;

	return module;
}

export async function loadPrismaAdapterModule() {
	const module = importDynamic('@lucia-auth/adapter-prisma') as Promise<typeof import('@lucia-auth/adapter-prisma')>;

	return module;
}

export async function loadLuciaMiddleware() {
	const module = importDynamic('lucia/middleware') as Promise<typeof import('lucia/middleware')>;

	return module;
}

export async function loadLuciaCryptoNode18() {
	const module = importDynamic('lucia/polyfill/node') as Promise<typeof import('lucia/polyfill/node')>;

	return module;
}

export const luciaModule = loadLuciaModule();
export const luciaUtils = loadLuciaUtils();
export const prismaAdapterModule = loadPrismaAdapterModule();
export const luciaMiddleware = loadLuciaMiddleware();
