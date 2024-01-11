import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { SocketModule } from './socket.module';
import { SocketService } from './socket.service';

describe('SocketService', () => {
	const manager = new TestManager({
		metadata: {
			imports: [SocketModule],
		},
	});
	let service: SocketService;

	beforeEach(async () => {
		await manager.setupTestModule();

		service = manager.module.get<SocketService>(SocketService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
