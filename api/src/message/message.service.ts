import { PrismaService } from '$prisma/prisma.service';
import { SocketService } from '$socket/socket.service';
import { Injectable } from '@nestjs/common';
import type { User } from 'lucia';
import { wsR } from '~contract';

@Injectable()
export class MessageService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly sockets: SocketService,
	) {}

	async list() {
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

		return messages;
	}

	async create(user: User, text: string) {
		const message = await this.prisma.message.create({
			data: {
				text,
				user: { connect: { email: user.email } },
			},
			include: {
				user: true,
			},
		});

		this.sockets.emit(wsR.messages.new, message);

		return message;
	}
}
