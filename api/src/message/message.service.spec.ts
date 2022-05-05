import { PrismaModule } from '$common/prisma/prisma.module';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageService } from './message.service';

describe('MessageService', () => {
	let service: MessageService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [PrismaModule],
			providers: [MessageService],
		}).compile();

		service = module.get<MessageService>(MessageService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
