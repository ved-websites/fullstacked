import { TestManager } from '$tests/TestManager';
import { beforeEach, describe, expect, it } from 'vitest';
import { SocketController } from './socket.controller';

describe('SocketController', () => {
	const manager = new TestManager({
		metadata: {
			controllers: [SocketController],
			providers: [],
		},
	});
	let controller: SocketController;

	beforeEach(async () => {
		await manager.setupTestModule();

		controller = manager.module.get<SocketController>(SocketController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
