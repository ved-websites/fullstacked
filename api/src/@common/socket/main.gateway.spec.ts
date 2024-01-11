import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { MainGateway } from './main.gateway';

describe('MainGateway', () => {
	const manager = new TestManager({
		metadata: {
			providers: [MainGateway],
		},
	});
	let gateway: MainGateway;

	beforeEach(async () => {
		await manager.setupTestModule();

		gateway = manager.module.get<MainGateway>(MainGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
