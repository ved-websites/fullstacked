import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminService } from '../admin.service';
import { ADMIN_CREATE_USER_EVENT_KEY, ADMIN_CREATE_USER_EVENT_TYPE } from './admin.events';

@Injectable()
export class AdminListener {
	private readonly logger = new Logger(AdminListener.name);

	constructor(private readonly adminService: AdminService) {}

	@OnEvent(ADMIN_CREATE_USER_EVENT_KEY)
	handleUserCreatedEvent([user, origin]: ADMIN_CREATE_USER_EVENT_TYPE) {
		this.adminService.sendNewUserRegistrationEmail(user, origin).catch((error) => {
			this.logger.error(
				`Error happened while sending email to new user "${user.email}".`,
				error instanceof Error ? error.stack : undefined,
			);
		});
	}
}
