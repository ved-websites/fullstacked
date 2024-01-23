import { AuthUser, LuciaUser } from '$users/auth/session.decorator';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { MessageService } from './message.service';

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
	newMessage(@AuthUser() user: LuciaUser) {
		return tsRestHandler(r.messages.new, async ({ body: { text } }) => {
			await this.messageService.create(user, text);

			return {
				status: 200,
				body: undefined,
			};
		});
	}
}
