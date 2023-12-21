import { AuthModule } from '$users/auth/auth.module';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { UserSecurityModule } from './security.module';
import { UserSecurityResolver } from './security.resolver';
import { UserSecurityService } from './security.service';

describe('UserSecurityResolver', () => {
	const manager = new TestManager({
		metadata: {
			imports: [UserSecurityModule, AuthModule, LuciaModule],
			providers: [UserSecurityResolver, UserSecurityService],
		},
	});
	let resolver: UserSecurityResolver;

	beforeEach(async () => {
		await manager.setupTestModule();

		resolver = manager.module.get<UserSecurityResolver>(UserSecurityResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
