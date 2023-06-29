import { ADMIN } from '$/@utils/roles';
import { loadLuciaUtils } from '$auth/lucia/modules-compat';
import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import type { GlobalDatabaseUserAttributes, User } from 'lucia';
import { Auth, LuciaFactory } from './lucia/lucia.factory';

@Injectable()
export class AuthService {
	constructor(@Inject(LuciaFactory) private readonly auth: Auth, private readonly prisma: PrismaService) {}

	protected defineEmailKey(email: string, password: string | null) {
		return {
			providerId: 'email',
			providerUserId: email,
			password,
		} as Parameters<typeof this.auth.createKey>[1];
	}

	async getAuthUser(email: string, select: PrismaSelector) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
			...select,
		});

		return user;
	}

	async createUser(email: string, password: string | null, attributes?: Omit<GlobalDatabaseUserAttributes, 'email'>) {
		const userWithEmail = await this.prisma.user.count({
			where: {
				email,
			},
		});

		if (userWithEmail !== 0) {
			throw new Error('A user with this email already exists!');
		}

		const registerTokenLength = 16;
		const registerToken = password ? undefined : (await loadLuciaUtils()).generateRandomString(registerTokenLength);

		const user = await this.auth.createUser({
			key: password ? this.defineEmailKey(email, password) : null,
			attributes: {
				email,
				registerToken,
				...attributes,
			},
		});

		return user;
	}

	async register(registerToken: string, password: string, attributes: Omit<GlobalDatabaseUserAttributes, 'email'>) {
		const user = await this.prisma.user.findFirst({
			where: {
				registerToken,
			},
			select: {
				id: true,
				email: true,
			},
		});

		if (!user) {
			throw new Error('Invalid userId!');
		}

		const key = await this.auth.createKey(user.id, this.defineEmailKey(user.email, password));

		await this.auth.updateUserAttributes(key.userId, {
			...attributes,
			registerToken: null,
		});

		return this.loginUser(key.userId);
	}

	async login(email: string, password: string) {
		const key = await this.auth.useKey('email', email, password);

		return this.loginUser(key.userId);
	}

	async loginUser(userId: string) {
		const session = await this.auth.createSession(userId);

		return session;
	}

	async logout(sessionId: string) {
		return await this.auth.invalidateSession(sessionId);
	}

	async renewSession(sessionId: string) {
		return await this.auth.renewSession(sessionId);
	}

	async userCanSendEmail(user: User) {
		const rolesCanSendEmail = [ADMIN];

		const userRoles = (
			await this.prisma.role.findMany({
				where: {
					users: {
						every: {
							email: user.email,
						},
					},
				},
				select: {
					text: true,
				},
			})
		).map((userRole) => userRole.text);

		return rolesCanSendEmail.some((role) => userRoles.some((userRole) => userRole === role));
	}
}
