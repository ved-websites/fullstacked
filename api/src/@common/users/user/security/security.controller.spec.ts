import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { SecurityController } from './security.controller';

describe('SecurityController', () => {
	const manager = new TestManager({
		metadata: {
			providers: [SecurityController],
		},
	});
	let controller: SecurityController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<SecurityController>(SecurityController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
