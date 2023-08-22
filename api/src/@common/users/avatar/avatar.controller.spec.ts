import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AvatarController } from './avatar.controller';

describe('AvatarController', () => {
	let controller: AvatarController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AvatarController],
		}).compile();

		controller = module.get<AvatarController>(AvatarController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
