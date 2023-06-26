import { luciaUtils } from '$auth/lucia/modules-compat';
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
		const registerTokenLength = 16;
		const registerToken = password ? undefined : (await luciaUtils).generateRandomString(registerTokenLength);

		const user = await this.auth.createUser({
			key: password
				? {
						providerId: 'email',
						providerUserId: email,
						password,
				  }
				: null,
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

		const key = await this.auth.createKey(user.id, {
			providerId: 'email',
			providerUserId: user.email,
			password,
		});

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
}
