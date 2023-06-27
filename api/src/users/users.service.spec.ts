import { AuthModule } from '$auth/auth.module';
import { LuciaFactory } from '$auth/lucia/lucia.factory';
import { RolesService } from '$auth/roles/roles.service';
import { PrismaModule } from '$prisma/prisma.module';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersService } from './users.service';

vi.mock('$auth/lucia/modules-compat');

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [PrismaModule, AuthModule],
			providers: [UsersService, { provide: LuciaFactory, useValue: {} }, RolesService],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
