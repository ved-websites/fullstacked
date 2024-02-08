import { Prisma, PrismaClient, User } from '$prisma-client';

export function getUserFullName(user: Pick<User, 'firstName' | 'lastName'>) {
	return user.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}` : null;
}

interface ExtendedClientProps {
	readonly $rawClient: PrismaClient;
}

class UntypedExtendedClient extends PrismaClient implements ExtendedClientProps {
	public readonly $rawClient: PrismaClient;

	constructor(...args: ConstructorParameters<typeof PrismaClient>) {
		super(...args);

		this.$rawClient = this;

		return extendPrismaClient(this) as this;
	}
}

function extendPrismaClient(prisma: PrismaClient) {
	return prisma
		.$extends({
			name: 'exists',
			model: {
				$allModels: {
					async exists<T>(this: T, where: NonNullable<Prisma.Args<T, 'findFirst'>['where']>): Promise<boolean> {
						const context = Prisma.getExtensionContext(this);

						const result = await (context as any).findFirst({ where });

						return result !== null;
					},
				},
			},
		})
		.$extends({
			name: 'userFullName',
			result: {
				user: {
					fullName: {
						needs: { firstName: true, lastName: true },
						compute(user) {
							return getUserFullName(user);
						},
					},
				},
			},
		})
		.$extends({
			name: 'userOmitHashedPassword',
			result: {
				user: {
					hashedPassword: {
						compute() {
							return null;
						},
					},
				},
			},
		});
}

export const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
	...args: ConstructorParameters<typeof PrismaClient>
) => ExtendedClientProps & ReturnType<typeof extendPrismaClient>;
