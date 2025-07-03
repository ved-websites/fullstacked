import { RoleCheck } from '$users/auth/roles/roles.guard';
import { AppUser, AuthUser } from '$users/auth/session/session.decorator';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { Roles } from '~shared';
import { MessageService } from './message.service';

@RoleCheck([Roles.CHAT])
@Controller()
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@TsRestHandler(r.messages.list)
	getMessages() {
		return tsRestHandler(r.messages.list, async () => {
			const messages = await this.messageService.list();

			return {
				status: 200,
				body: messages,
			};
		});
	}

	@TsRestHandler(r.messages.new)
	newMessage(@AuthUser() user: AppUser) {
		return tsRestHandler(r.messages.new, async ({ body: { text } }) => {
			await this.messageService.create(user, text);

			return {
				status: 200,
				body: undefined,
			};
		});
	}
}
