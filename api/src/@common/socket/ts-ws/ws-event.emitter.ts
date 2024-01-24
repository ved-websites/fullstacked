import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export type ListenerFn = (...args: unknown[]) => unknown;

@Injectable()
export class WsEventEmitter {
	private emitter = new EventEmitter2({
		ignoreErrors: true,
		maxListeners: 0, // unlimited
		delimiter: ':',
	});

	on(event: string, listener: ListenerFn) {
		this.emitter.on(event, listener);
	}

	off(event: string, listener: ListenerFn) {
		this.emitter.off(event, listener);
	}

	emit(event: string, data?: unknown) {
		return this.emitter.emit(event, data);
	}
}
