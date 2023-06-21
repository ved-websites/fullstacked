import { Auth, AuthFactory } from '$common/lucia/lucia.module';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	constructor(@Inject(AuthFactory) private readonly auth: Auth) {}

	async register(username: string, password: string) {
		const user = await this.auth.createUser({
			primaryKey: {
				providerId: 'username',
				providerUserId: username,
				password,
			},
			attributes: {},
		});

		return user;
	}

	async login(username: string, password: string) {
		const key = await this.auth.createKey(username, {
			providerId: 'username',
			providerUserId: username,
			password,
			type: 'persistent',
		});

		const session = await this.auth.createSession(key.userId);

		return session;
	}
}
