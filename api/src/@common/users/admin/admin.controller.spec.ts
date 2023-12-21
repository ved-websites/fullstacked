import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
	let controller: AdminController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AdminController],
		}).compile();

		controller = module.get<AdminController>(AdminController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
