import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { Inject, Injectable } from '@nestjs/common';
import type { GlobalDatabaseUserAttributes } from 'lucia';
import { Auth, LuciaFactory } from './lucia/lucia.factory';

@Injectable()
export class AuthService {
	constructor(@Inject(LuciaFactory) private readonly auth: Auth, private readonly prisma: PrismaService) {}

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
		const user = await this.auth.createUser({
			key: {
				providerId: 'email',
				providerUserId: email,
				password,
			},
			attributes: {
				email,
				...attributes,
			},
		});

		return user;
	}

	async register(...args: Parameters<typeof this.createUser>) {
		const user = await this.createUser(...args);

		return this.loginUser(user.userId);
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
}
