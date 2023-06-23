import { Auth, LuciaFactory } from '$common/lucia/lucia.factory';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	constructor(@Inject(LuciaFactory) private readonly auth: Auth) {}

	async register(email: string, password: string) {
		const user = await this.auth.createUser({
			key: {
				providerId: 'email',
				providerUserId: email,
				password,
			},
			attributes: {
				email,
			},
		});

		const session = await this.auth.createSession(user.id);

		return session;
	}

	async login(email: string, password: string) {
		const key = await this.auth.useKey('email', email, password);

		const session = await this.auth.createSession(key.userId);

		return session;
	}

	async logout(sessionId: string) {
		return await this.auth.invalidateSession(sessionId);
	}

	async renewSession(sessionId: string) {
		return await this.auth.renewSession(sessionId);
	}
}
