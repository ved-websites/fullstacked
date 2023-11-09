import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { UserProfileService } from './profile.service';

describe('UserProfileService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule],
			providers: [UserProfileService],
		},
	});
	let service: UserProfileService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<UserProfileService>(UserProfileService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
