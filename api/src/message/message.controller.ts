import { PrismaService } from '$prisma/prisma.service';
import { AuthSession, LuciaSession } from '$users/auth/session.decorator';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r } from '~contract';
import { MESSAGE_ADDED } from './constants/triggers';

@Controller()
export class MessageController {
	constructor(private readonly prisma: PrismaService) {}

	@TsRestHandler(r.messages.list)
	async getMessages() {
		return tsRestHandler(r.messages.list, async () => {
			const messages = await this.prisma.message.findMany({
				select: {
					id: true,
					text: true,
					time: true,
					user: {
						select: {
							email: true,
							firstName: true,
							lastName: true,
							profilePictureRef: true,
						},
					},
				},
			});

			return {
				status: 200,
				body: messages,
			};
		});
	}

	@TsRestHandler(r.messages.new)
	async newMessage(@AuthSession() { user }: LuciaSession) {
		return tsRestHandler(r.messages.new, async ({ body: { text } }) => {
			await this.prisma.mutate([MESSAGE_ADDED], {}, () => {
				return this.prisma.message.create({
					data: {
						text,
						user: { connect: { email: user.email } },
					},
				});
			});

			return {
				status: 200,
				body: undefined,
			};
		});
	}
}
