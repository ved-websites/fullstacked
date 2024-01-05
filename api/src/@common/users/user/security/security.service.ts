import { AuthService } from '$users/auth/auth.service';
import { Auth, LuciaFactory } from '$users/auth/lucia/lucia.factory';
import { LuciaUser } from '$users/auth/session.decorator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserSecurityService {
	constructor(
		private readonly authService: AuthService,
		@Inject(LuciaFactory) private readonly auth: Auth,
	) {}

	async editSelfPassword(user: LuciaUser, newPassword: string) {
		await this.auth.updateKeyPassword(this.authService.providerId, user.email, newPassword);
	}
}
