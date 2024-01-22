import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { UsersGateway } from './users.gateway';

describe('UsersGateway', () => {
	let gateway: UsersGateway;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersGateway],
		}).compile();

		gateway = module.get<UsersGateway>(UsersGateway);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});
});
