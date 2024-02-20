import { EmailModule } from '$email/email.module';
import { TestManager } from '$tests/TestManager';
import { PresenceModule } from '$users/presence/presence.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserProfileService } from './profile.service';

describe('UserProfileService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [EmailModule, PresenceModule],
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
