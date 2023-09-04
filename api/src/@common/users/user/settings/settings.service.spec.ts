import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule],
			providers: [SettingsService],
		},
	});
	let service: SettingsService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<SettingsService>(SettingsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
