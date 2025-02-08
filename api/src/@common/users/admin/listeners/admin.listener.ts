import { EventData, OnEvent } from '$events/events.decorator';
import { Injectable, Logger } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { ADMIN_CREATE_USER_EVENT } from './admin.events';

@Injectable()
export class AdminListener {
	private readonly logger = new Logger(AdminListener.name);

	constructor(private readonly adminService: AdminService) {}

	@OnEvent(ADMIN_CREATE_USER_EVENT)
	handleUserCreatedEvent([user, origin]: EventData<typeof ADMIN_CREATE_USER_EVENT>) {
		this.adminService.sendNewUserRegistrationEmail(user, origin).catch((error) => {
			this.logger.error(
				`Error happened while sending email to new user "${user.email}".`,
				error instanceof Error ? error.stack : undefined,
			);
		});
	}
}
