import { TestManager } from '$tests/TestManager';
import { AuthModule } from '$users/auth/auth.module';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserSecurityService } from './security.service';

describe('UserSecurityService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [AuthModule, LuciaModule],
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
