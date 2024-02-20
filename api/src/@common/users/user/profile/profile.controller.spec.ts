import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfileController } from './profile.controller';
import { UserProfileModule } from './profile.module';

describe('ProfileController', () => {
	const manager = new TestManager({
		metadata: {
			imports: [UserProfileModule],
			providers: [ProfileController],
		},
	});
	let controller: ProfileController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<ProfileController>(ProfileController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
