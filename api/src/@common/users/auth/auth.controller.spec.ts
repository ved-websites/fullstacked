import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
	const manager = new TestManager({
		metadata: {
			controllers: [AuthController],
			providers: [],
		},
	});
	let controller: AuthController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
