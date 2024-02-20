import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { PresenceService } from './presence.service';

describe('PresenceService', () => {
	const manager = new TestManager({
		metadata: {
			providers: [PresenceService],
		},
	});
	let service: PresenceService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<PresenceService>(PresenceService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
