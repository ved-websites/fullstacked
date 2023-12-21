import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { HomeController } from './home.controller';

describe('HomeController', () => {
	const manager = new TestManager({
		metadata: {
			controllers: [HomeController],
		},
	});
	let controller: HomeController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<HomeController>(HomeController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
