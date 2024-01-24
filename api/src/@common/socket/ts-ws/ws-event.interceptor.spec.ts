import { SocketService } from '$socket/socket.service';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestManager } from '~utils/tests/TestManager';
import { WsEventEmitter } from './ws-event.emitter';
import { WsEventInterceptor } from './ws-event.interceptor';

describe('WsEventInterceptor', () => {
	const manager = new TestManager();
	let interceptor: WsEventInterceptor;

	beforeEach(async () => {
		await manager.setupTestModule();

		const reflector = manager.module.get<Reflector>(Reflector);
		const socketService = manager.module.get<SocketService>(SocketService);
		const wsEventEmitter = manager.module.get<WsEventEmitter>(WsEventEmitter);

		interceptor = new WsEventInterceptor(reflector, socketService, wsEventEmitter);
	});

	it('should be defined', () => {
		expect(interceptor).toBeDefined();
	});
});
