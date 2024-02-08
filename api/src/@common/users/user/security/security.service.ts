import { AuthService } from '$users/auth/auth.service';
import { LuciaUser } from '$users/auth/session.decorator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSecurityService {
	constructor(private readonly authService: AuthService) {}

	async editSelfPassword(user: LuciaUser, newPassword: string) {
		await this.authService.updatePassword(user, newPassword);
	}
}
