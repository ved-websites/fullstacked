import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { EventDefinition } from './event.definition';

@Injectable()
export class EventsService {
	constructor(private readonly eventEmitter: EventEmitter2) {}

	emit<T>(...args: T extends void ? [event: EventDefinition<T>] : [event: EventDefinition<T>, data: T]) {
		const [event, data] = args;

		return this.eventEmitter.emit(event.name, data);
	}

	emitAsync<T>(...args: T extends void ? [event: EventDefinition<T>] : [event: EventDefinition<T>, data: T]) {
		const [event, data] = args;

		return this.eventEmitter.emitAsync(event.name, data);
	}
}
