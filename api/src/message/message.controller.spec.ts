import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { MessageController } from './message.controller';

describe('MessageController', () => {
	const manager = new TestManager({
		metadata: {
			controllers: [MessageController],
			providers: [],
		},
	});
	let controller: MessageController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<MessageController>(MessageController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
