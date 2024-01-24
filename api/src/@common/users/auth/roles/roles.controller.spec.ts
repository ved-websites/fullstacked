import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { RolesController } from './roles.controller';

describe('RolesController', () => {
	const manager = new TestManager({
		metadata: {
			controllers: [RolesController],
			providers: [],
		},
	});
	let controller: RolesController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<RolesController>(RolesController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
