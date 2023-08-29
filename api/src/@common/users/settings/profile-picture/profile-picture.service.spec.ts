import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfilePictureService } from './profile-picture.service';

describe('ProfilePictureService', () => {
	let service: ProfilePictureService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ProfilePictureService],
		}).compile();

		service = module.get<ProfilePictureService>(ProfilePictureService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
