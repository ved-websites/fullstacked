import { PrismaModule } from '$prisma/prisma.module';
import { PresenceModule } from '$users/presence/presence.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { UserProfileResolver } from './profile.resolver';
import { UserProfileService } from './profile.service';

describe('UserProfileResolver', () => {
	const manager = new TestManager({
		metadata: {
			imports: [PrismaModule, PresenceModule],
			providers: [UserProfileResolver, UserProfileService],
		},
	});
	let resolver: UserProfileResolver;

	beforeEach(async () => {
		await manager.setupTestModule();

		resolver = manager.module.get<UserProfileResolver>(UserProfileResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
