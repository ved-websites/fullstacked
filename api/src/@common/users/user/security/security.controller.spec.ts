import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { SecurityController } from './security.controller';
import { UserSecurityModule } from './security.module';

describe('SecurityController', () => {
	const manager = new TestManager({
		metadata: {
			imports: [UserSecurityModule],
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
