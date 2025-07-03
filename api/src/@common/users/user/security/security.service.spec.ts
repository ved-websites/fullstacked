import { EmailModule } from '$email/email.module';
import { TestManager } from '$tests/TestManager';
import { AuthModule } from '$users/auth/auth.module';
import { PresenceModule } from '$users/presence/presence.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserSecurityService } from './security.service';

describe('UserSecurityService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [AuthModule, EmailModule, PresenceModule],
			providers: [UserSecurityService],
		},
	});
	let service: UserSecurityService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<UserSecurityService>(UserSecurityService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
