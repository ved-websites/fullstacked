import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureModule } from './profile-picture.module';

describe('ProfilePictureController', () => {
	const manager = new TestManager({
		metadata: {
			imports: [ProfilePictureModule],
			controllers: [ProfilePictureController],
		},
	});
	let controller: ProfilePictureController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<ProfilePictureController>(ProfilePictureController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
