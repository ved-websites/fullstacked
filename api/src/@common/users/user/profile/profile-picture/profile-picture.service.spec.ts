import { MinioClientModule } from '$minio/minio-client.module';
import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { ProfilePictureService } from './profile-picture.service';

describe('ProfilePictureService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule, MinioClientModule],
			providers: [ProfilePictureService],
		},
	});
	let service: ProfilePictureService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<ProfilePictureService>(ProfilePictureService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
