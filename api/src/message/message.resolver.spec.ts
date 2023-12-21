import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

describe('MessageResolver', () => {
	const manager = new TestManager({
		metadata: {
			providers: [MessageResolver, MessageService],
		},
	});
	let resolver: MessageResolver;

	beforeEach(async () => {
		await manager.setupTestModule();

		resolver = manager.module.get<MessageResolver>(MessageResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
