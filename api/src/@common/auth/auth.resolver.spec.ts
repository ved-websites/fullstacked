import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthResolver } from './auth.resolver';

describe('AuthResolver', () => {
	let resolver: AuthResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthResolver],
		}).compile();

		resolver = module.get<AuthResolver>(AuthResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
