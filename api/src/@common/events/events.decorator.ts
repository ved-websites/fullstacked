import { applyDecorators } from '@nestjs/common';
import { OnEvent as NestOnEvent } from '@nestjs/event-emitter';
import type { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { EventDefinition } from './event.definition';

export type EventData<E extends EventDefinition<unknown>> = E extends EventDefinition<infer T> ? T : never;

export function OnEvent<T>(event: EventDefinition<T>, options?: OnEventOptions) {
	return applyDecorators(NestOnEvent(event.name, options));
}
