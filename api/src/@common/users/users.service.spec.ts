import { AuthModule } from '$auth/auth.module';
import { LuciaFactory } from '$auth/lucia/lucia.factory';
import { RolesService } from '$auth/roles/roles.service';
import { ConfigModule } from '$configs/config.module';
import { EmailModule } from '$email/email.module';
import { PrismaModule } from '$prisma/prisma.module';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { UsersService } from './users.service';

vi.mock('$auth/lucia/modules-compat');

describe('UsersService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [ConfigModule, PrismaModule, AuthModule, EmailModule],
			providers: [UsersService, { provide: LuciaFactory, useValue: {} }, RolesService],
		},
	});
	let service: UsersService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
