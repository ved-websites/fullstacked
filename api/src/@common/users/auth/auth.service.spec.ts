import { ConfigModule } from '$configs/config.module';
import { EmailModule } from '$email/email.module';
import { PresenceModule } from '$users/presence/presence.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { AuthService } from './auth.service';
import { LuciaFactory } from './lucia/lucia.factory';
import { RolesModule } from './roles/roles.module';

describe('AuthService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [ConfigModule, RolesModule, EmailModule, PresenceModule],
			providers: [AuthService, { provide: LuciaFactory, useValue: {} }],
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
