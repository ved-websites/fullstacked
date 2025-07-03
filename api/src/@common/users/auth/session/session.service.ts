import { CryptoService } from '$crypto/crypto.service';
import { PrismaService } from '$prisma/prisma.service';
import { msMonths } from '$utils/time';
import { Injectable } from '@nestjs/common';
import { SESSION_COOKIE_NAME } from '~shared';
import { CookieService } from '../cookie.service';
import { UserContainer } from '../types';

@Injectable()
export class SessionService {
	static readonly SESSION_DURATION = msMonths(2);

	constructor(
		private readonly prisma: PrismaService,
		private readonly cookieService: CookieService,
		private readonly cryptoService: CryptoService,
	) {}

	async createSession(userId: string) {
		const now = new Date();

		const id = this.cryptoService.generateSecureRandomString();
		const secret = this.cryptoService.generateSecureRandomString();

		const secretHash = await this.cryptoService.hashSecret(secret);

		const token = id + '.' + secret;

		const session = await this.prisma.session.create({
			data: {
				id,
				secretHash,
				userId,
				expiresAt: new Date(now.getTime() + SessionService.SESSION_DURATION),
			},
		});

		return { token, ...session };
	}

	async extendSession(sessionId: string) {
		await this.prisma.session.update({
			where: {
				id: sessionId,
			},
			data: {
				expiresAt: new Date(Date.now() + SessionService.SESSION_DURATION),
			},
		});
	}

	protected extractSessionDataFromToken(token: string) {
		const tokenParts = token.split('.');

		if (tokenParts.length !== 2) {
			return null;
		}

		const [sessionId, sessionSecret] = tokenParts as [string, string];

		return { sessionId, sessionSecret };
	}

	async validateSessionToken(token: string): Promise<UserContainer & { fresh: boolean }> {
		const sessionData = this.extractSessionDataFromToken(token);

		if (!sessionData) {
			return { user: null, session: null, fresh: false };
		}

		const { sessionId, sessionSecret } = sessionData;

		const [container, tokenSecretHash] = await Promise.all([
			this.getSessionAndUser(sessionId),
			this.cryptoService.hashSecret(sessionSecret),
		]);

		if (!container.session) {
			return { user: null, session: null, fresh: false };
		}

		const validSecret = this.cryptoService.constantTimeEqual(tokenSecretHash, container.session.secretHash);

		if (!validSecret) {
			return { user: null, session: null, fresh: false };
		}

		const now = new Date();

		const fresh = now.getTime() >= container.session.expiresAt.getTime() - SessionService.SESSION_DURATION / 2;

		if (fresh) {
			await this.extendSession(container.session.id);
		}

		return { ...container, fresh };
	}

	async getSessionAndUser(sessionId: string): Promise<UserContainer> {
		const now = new Date();

		const result = await this.prisma.session.findFirst({
			where: {
				id: sessionId,
				expiresAt: {
					gte: now, // Ensure the session is not expired
				},
			},
			include: {
				user: true,
			},
		});

		if (!result) {
			return { user: null, session: null };
		}

		const { user, ...session } = result;

		return { user, session };
	}

	async deleteSession(sessionId: string): Promise<void> {
		await this.prisma.session.delete({
			where: {
				id: sessionId,
			},
		});
	}

	async deleteExpiredSessions() {
		const now = new Date();

		return this.prisma.session.deleteMany({
			where: {
				expiresAt: {
					lt: now,
				},
			},
		});
	}

	createSessionCookie(token: string) {
		return this.cookieService.createCookie(SESSION_COOKIE_NAME, token, {
			maxAge: SessionService.SESSION_DURATION,
		});
	}

	createBlankSessionCookie() {
		return this.cookieService.createBlankCookie(SESSION_COOKIE_NAME);
	}

	async invalidateUserSessions(userId: string): Promise<void> {
		await this.prisma.session.deleteMany({
			where: {
				userId,
			},
		});
	}

	readBearerToken(authorizationHeader: string): string | null {
		const [authScheme, token] = authorizationHeader.split(' ') as [string, string | undefined];

		if (authScheme !== 'Bearer') {
			return null;
		}

		return token ?? null;
	}
}
