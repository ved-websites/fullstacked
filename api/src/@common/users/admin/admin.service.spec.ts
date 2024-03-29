import { EmailModule } from '$email/email.module';
import { TestManager } from '$tests/TestManager';
import { AuthModule } from '$users/auth/auth.module';
import { RolesService } from '$users/auth/roles/roles.service';
import { PresenceModule } from '$users/presence/presence.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { AdminService } from './admin.service';

describe('AdminService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [AuthModule, EmailModule, PresenceModule],
			providers: [AdminService, RolesService],
		},
	});
	let service: AdminService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<AdminService>(AdminService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
