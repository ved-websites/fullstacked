import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { MessageGateway } from './message.gateway';

describe('MessageGateway', () => {
	const manager = new TestManager({
		metadata: {
			providers: [MessageGateway],
		},
	});
	let gateway: MessageGateway;

	beforeEach(async () => {
		await manager.setupTestModule();

		gateway = manager.module.get<MessageGateway>(MessageGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
