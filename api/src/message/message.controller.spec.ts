import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageController } from './message.controller';
import { MessageModule } from './message.module';

describe('MessageController', () => {
	const manager = new TestManager({
		metadata: {
			imports: [MessageModule],
			controllers: [MessageController],
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
