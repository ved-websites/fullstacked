import { PrismaSelector, PrismaService } from '$prisma/prisma.service';
import { loadLuciaUtils } from '$users/auth/lucia/modules-compat';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { GlobalDatabaseUserAttributes } from 'lucia';
import { Auth, LuciaFactory } from './lucia/lucia.factory';

@Injectable()
export class AuthService {
	constructor(
		@Inject(LuciaFactory) private readonly auth: Auth,
		private readonly prisma: PrismaService,
	) {}

	readonly providerId = 'email';

	protected defineEmailKey(email: string, password: string | null) {
		return {
			providerId: this.providerId,
			providerUserId: email,
			password,
		} as Parameters<typeof this.auth.createKey>[0];
	}

	async getLuciaUser(userId: string) {
		return this.auth.getUser(userId);
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

	async getUnregisteredUser(registerToken: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				registerToken,
			},
			select: {
				email: true,
				firstName: true,
				lastName: true,
			},
		});

		if (!user) {
			throw new Error('Invalid registration token!');
		}

		return user;
	}

	async createUser(email: string, password: string | null, attributes?: Omit<GlobalDatabaseUserAttributes, 'email'>) {
		const userWithEmail = await this.prisma.user.count({
			where: {
				email,
			},
		});

		if (userWithEmail !== 0) {
			throw new BadRequestException('A user with this email already exists!');
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

		const key = await this.auth.createKey({ ...this.defineEmailKey(user.email, password), userId: user.id });

		await this.auth.updateUserAttributes(key.userId, {
			...attributes,
			registerToken: null,
		});

		return this.loginUser(key.userId);
	}

	async login(email: string, password: string) {
		const key = await this.auth.useKey(this.providerId, email, password);

		return this.loginUser(key.userId);
	}

	async loginUser(userId: string) {
		const session = await this.auth.createSession({ userId, attributes: {} });

		return session;
	}

	async logout(sessionId: string) {
		return await this.auth.invalidateSession(sessionId);
	}
}
