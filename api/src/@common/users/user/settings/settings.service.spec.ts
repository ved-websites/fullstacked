import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { UserSettingsService } from './settings.service';

describe('UserSettingsService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule],
			providers: [UserSettingsService],
		},
	});
	let service: UserSettingsService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<UserSettingsService>(UserSettingsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
