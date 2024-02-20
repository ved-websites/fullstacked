import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { AdminController } from './admin.controller';
import { AdminModule } from './admin.module';

describe('AdminController', () => {
	const manager = new TestManager({
		metadata: {
			imports: [AdminModule],
		},
	});
	let controller: AdminController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<AdminController>(AdminController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
