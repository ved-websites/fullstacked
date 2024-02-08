const importDynamic = new Function('modulePath', 'return import(modulePath)');

export async function loadLuciaModule() {
	const module = importDynamic('lucia') as Promise<typeof import('lucia')>;

	return module;
}

export async function loadPrismaAdapterModule() {
	const module = importDynamic('@lucia-auth/adapter-prisma') as Promise<typeof import('@lucia-auth/adapter-prisma')>;

	return module;
}

export async function loadOsloPasswordModule() {
	const module = importDynamic('oslo/password') as Promise<typeof import('oslo/password')>;

	return module;
}

export async function loadOsloCryptoModule() {
	const module = importDynamic('oslo/crypto') as Promise<typeof import('oslo/crypto')>;

	return module;
}
