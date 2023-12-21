import { MinioClientModule } from '$minio/minio-client.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureService } from './profile-picture.service';

describe('ProfilePictureController', () => {
	const manager = new TestManager({
		metadata: {
			imports: [MinioClientModule],
			controllers: [ProfilePictureController],
			providers: [ProfilePictureService],
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
