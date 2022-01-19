import { Test, TestingModule } from '@nestjs/testing';
import { PubSub } from './pub-sub';

describe('PubSub', () => {
	let provider: PubSub;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PubSub],
		}).compile();

		provider = module.get<PubSub>(PubSub);
	});

	it('should be defined', () => {
		expect(provider).toBeDefined();
	});
});
