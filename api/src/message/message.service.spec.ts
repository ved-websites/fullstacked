import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageService } from './message.service';

describe('MessageService', () => {
	const manager = new TestManager({
		metadata: {
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
