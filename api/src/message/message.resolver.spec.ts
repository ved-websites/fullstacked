import { PrismaModule } from '$common/prisma/prisma.module';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

describe('MessageResolver', () => {
	let resolver: MessageResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [PrismaModule],
			providers: [MessageResolver, MessageService],
		}).compile();

		resolver = module.get<MessageResolver>(MessageResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
