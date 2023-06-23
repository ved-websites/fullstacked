const importDynamic = new Function('modulePath', 'return import(modulePath)');

export async function luciaModule() {
	const module = importDynamic('lucia') as Promise<typeof import('lucia')>;

	return module;
}
export async function luciaUtils() {
	const module = importDynamic('lucia/utils') as Promise<typeof import('lucia/utils')>;

	return module;
}

export async function prismaAdapterModule() {
	const module = importDynamic('@lucia-auth/adapter-prisma') as Promise<typeof import('@lucia-auth/adapter-prisma')>;

	return module;
}

export async function luciaMiddleware() {
	const module = importDynamic('lucia/middleware') as Promise<typeof import('lucia/middleware')>;

	return module;
}

export async function luciaCryptoNode18() {
	const module = importDynamic('lucia/polyfill/node') as Promise<typeof import('lucia/polyfill/node')>;

	return module;
}
