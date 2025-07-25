import { ConfigModule } from '$configs/config.module';
import { EmailModule } from '$email/email.module';
import { TestManager } from '$tests/TestManager';
import { PresenceModule } from '$users/presence/presence.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from './auth.service';
import { RolesModule } from './roles/roles.module';

describe('AuthService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [ConfigModule, RolesModule, EmailModule, PresenceModule],
			providers: [AuthService],
		},
	});
	let service: AuthService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
