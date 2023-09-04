import { EmailService } from '$users/email/email.service';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnvironmentConfig } from '~/env.validation';
import { ADMIN_CREATE_USER_EVENT_KEY, ADMIN_CREATE_USER_EVENT_TYPE } from './admin.events';

@Injectable()
export class AdminListener {
	private readonly logger = new Logger(AdminListener.name);

	constructor(
		private readonly email: EmailService,
		private readonly env: EnvironmentConfig,
	) {}

	@OnEvent(ADMIN_CREATE_USER_EVENT_KEY, { async: true })
	async handleUserCreatedEvent({ user, options }: ADMIN_CREATE_USER_EVENT_TYPE) {
		if (!user.registerToken) {
			return;
		}

		const templateData = {
			name: user.fullName ?? user.email,
			url: `${options.origin}/register?token=${user.registerToken}`,
		};

		try {
			await this.email.renderAndSend(['../emails/RegisterEmail.hbs', templateData], {
				to: { email: user.email, name: user.fullName },
				from: { email: this.env.EMAIL_FROM, name: options.originUser.fullName },
				replyTo: { email: options.originUser.email, name: options.originUser.fullName },
				subject: `You have been invited to join the Fullstacked website!`,
			});
		} catch (error) {
			this.logger.error(
				`Error happened while sending email to new user "${user.email}".`,
				error instanceof Error ? error.stack : undefined,
			);
		}
	}
}
