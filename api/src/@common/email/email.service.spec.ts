import { ConfigModule } from '$configs/config.module';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { EmailService } from './email.service';

describe('EmailService', () => {
	let service: EmailService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule, HttpModule],
			providers: [EmailService],
		}).compile();

		service = module.get<EmailService>(EmailService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
