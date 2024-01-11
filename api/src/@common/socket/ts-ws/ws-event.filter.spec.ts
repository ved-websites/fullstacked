import { SocketService } from '$socket/socket.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { WsEventExceptionsFilter } from './ws-event.filter';

describe('WsEventExceptionsFilter', () => {
	const manager = new TestManager();
	let filter: WsEventExceptionsFilter;

	beforeEach(async () => {
		await manager.setupTestModule();

		const socketService = manager.module.get<SocketService>(SocketService);

		filter = new WsEventExceptionsFilter(socketService);
	});

	it('should be defined', () => {
		expect(filter).toBeDefined();
	});
});
