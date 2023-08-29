import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { SettingsResolver } from './settings.resolver';
import { SettingsService } from './settings.service';

describe('SettingsResolver', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule],
			providers: [SettingsResolver, SettingsService],
		},
	});
	let resolver: SettingsResolver;

	beforeEach(async () => {
		await manager.setupTestModule();

		resolver = manager.module.get<SettingsResolver>(SettingsResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
