import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { UsersGateway } from './users.gateway';

describe('UsersGateway', () => {
	const manager = new TestManager({
		metadata: {
			providers: [UsersGateway],
		},
	});
	let gateway: UsersGateway;

	beforeEach(async () => {
		await manager.setupTestModule();

		gateway = manager.module.get<UsersGateway>(UsersGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
