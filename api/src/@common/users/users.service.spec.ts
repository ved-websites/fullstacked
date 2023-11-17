import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~/@utils/tests/TestManager';
import { UsersService } from './users.service';

describe('UsersService', () => {
	const manager = new TestManager({
		metadata: {
			providers: [UsersService],
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
