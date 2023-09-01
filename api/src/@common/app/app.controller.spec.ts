import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { AppController } from './app.controller';

describe('AppController', () => {
	const manager = new TestManager({
		metadata: {
			controllers: [AppController],
		},
	});
	let controller: AppController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<AppController>(AppController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
