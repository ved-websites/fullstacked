import { TestManager } from '$tests/TestManager';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { beforeEach, describe, expect, it } from 'vitest';
import { ContextService } from './context.service';

describe('ContextService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [LuciaModule],
			providers: [ContextService],
		},
	});
	let service: ContextService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<ContextService>(ContextService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
