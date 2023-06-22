export async function luciaModule() {
	const module = await (eval(`import('lucia')`) as Promise<typeof import('lucia')>);

	return module;
}
export async function luciaUtils() {
	const module = await (eval(`import('lucia/utils')`) as Promise<typeof import('lucia/utils')>);

	return module;
}

export async function prismaAdapterModule() {
	const module = await (eval(`import('@lucia-auth/adapter-prisma')`) as Promise<typeof import('@lucia-auth/adapter-prisma')>);

	return module;
}

export async function luciaMiddleware() {
	const module = await (eval(`import('lucia/middleware')`) as Promise<typeof import('lucia/middleware')>);

	return module;
}

export async function luciaCryptoNode18() {
	const module = await (eval(`import('lucia/polyfill/node')`) as Promise<typeof import('lucia/polyfill/node')>);

	return module;
}
