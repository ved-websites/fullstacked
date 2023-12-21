import { HttpModule } from '@nestjs/axios';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { EmailService } from './email.service';

describe('EmailService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [HttpModule],
			providers: [EmailService],
		},
	});
	let service: EmailService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<EmailService>(EmailService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
