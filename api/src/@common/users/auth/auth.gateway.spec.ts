import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { AuthGateway } from './auth.gateway';

describe('AuthGateway', () => {
	const manager = new TestManager({
		metadata: {
			providers: [AuthGateway],
		},
	});
	let gateway: AuthGateway;

	beforeEach(async () => {
		await manager.setupTestModule();

		gateway = manager.module.get<AuthGateway>(AuthGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
