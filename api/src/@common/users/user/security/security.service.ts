import { AuthService } from '$users/auth/auth.service';
import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
import { LuciaSession } from '$users/auth/session.decorator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserSecurityService {
	constructor(
		private readonly authService: AuthService,
		@Inject(LuciaFactory) private readonly auth: Auth,
	) {}

	async editSelfPassword(session: LuciaSession, newPassword: string) {
		const { user } = session;

		await this.auth.deleteKey(this.authService.providerId, user.email);

		const newKey = await this.auth.createKey(this.authService.defineEmailKey(user.email, newPassword, user.id));

		const newSession = await this.authService.loginUser(newKey.userId);

		await this.auth.invalidateSession(session.sessionId);

		return newSession;
	}
}
