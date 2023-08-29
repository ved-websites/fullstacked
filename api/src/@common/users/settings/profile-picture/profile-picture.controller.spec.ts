import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfilePictureController } from './profile-picture.controller';

describe('ProfilePictureController', () => {
	let controller: ProfilePictureController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProfilePictureController],
		}).compile();

		controller = module.get<ProfilePictureController>(ProfilePictureController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
