import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { UserSettingsResolver } from './settings.resolver';
import { UserSettingsService } from './settings.service';

describe('UserSettingsResolver', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule],
			providers: [UserSettingsResolver, UserSettingsService],
		},
	});
	let resolver: UserSettingsResolver;

	beforeEach(async () => {
		await manager.setupTestModule();

		resolver = manager.module.get<UserSettingsResolver>(UserSettingsResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
