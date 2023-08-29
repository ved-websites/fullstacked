import { MinioClientModule } from '$minio/minio-client.module';
import { PrismaModule } from '$prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureService } from './profile-picture.service';

describe('ProfilePictureController', () => {
	const manager = new TestManager({
		metadata: {
			imports: [
				PrismaModule,
				MinioClientModule,
				EventEmitterModule.forRoot({
					global: true,
					verboseMemoryLeak: true,
				}),
			],
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
