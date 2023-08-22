import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AvatarService } from './avatar.service';

describe('AvatarService', () => {
	let service: AvatarService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AvatarService],
		}).compile();

		service = module.get<AvatarService>(AvatarService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
