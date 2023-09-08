import { Test, TestingModule } from '@nestjs/testing';
import { UserSecurityResolver } from './security.resolver';

describe('SecurityResolver', () => {
	let resolver: UserSecurityResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UserSecurityResolver],
		}).compile();

		resolver = module.get<UserSecurityResolver>(UserSecurityResolver);
	});

	it('should be defined', () => {
		expect(resolver).toBeDefined();
	});
});
