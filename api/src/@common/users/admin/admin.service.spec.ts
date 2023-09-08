import { PrismaModule } from '$prisma/prisma.module';
import { AuthModule } from '$users/auth/auth.module';
import { RolesService } from '$users/auth/roles/roles.service';
import { EmailModule } from '$users/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { AdminService } from './admin.service';

describe('AdminService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [
				PrismaModule,
				AuthModule,
				EventEmitterModule.forRoot({
					global: true,
					verboseMemoryLeak: true,
				}),
				EmailModule,
			],
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
