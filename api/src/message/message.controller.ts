import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { AuthSession, LuciaSession } from '$users/auth/session.decorator';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { r, wsR } from '~contract';

@Controller()
export class MessageController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly sockets: SocketService,
	) {}

	@TsRestHandler(r.messages.list)
	getMessages() {
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
	newMessage(@AuthSession() { user }: LuciaSession) {
		return tsRestHandler(r.messages.new, async ({ body: { text } }) => {
			const message = await this.prisma.message.create({
				data: {
					text,
					user: { connect: { email: user.email } },
				},
			});

			this.sockets.emit(wsR.messages.new, message);

			return {
				status: 200,
				body: undefined,
			};
		});
	}
}
