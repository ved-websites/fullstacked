export async function luciaModule() {
	const module = await (eval(`import('lucia-auth')`) as Promise<typeof import('lucia-auth')>);

	return module.default;
}

export async function prismaAdapterModule() {
	const module = await (eval(`import('@lucia-auth/adapter-prisma')`) as Promise<typeof import('@lucia-auth/adapter-prisma')>);

	return module.default;
}

export async function luciaMiddleware() {
	const module = await (eval(`import('lucia-auth/middleware')`) as Promise<typeof import('lucia-auth/middleware')>);

	return module;
}
