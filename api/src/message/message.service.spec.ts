import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { MessageService } from './message.service';

describe('MessageService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule],
			providers: [MessageService],
		},
	});
	let service: MessageService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<MessageService>(MessageService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
