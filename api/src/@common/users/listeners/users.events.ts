import { createEventDefinition } from '$events/event.definition';

export const USERS_ON_CONNECT_EVENT = createEventDefinition<string>('users.connect');
export const USERS_ON_DISCONNECT_EVENT = createEventDefinition<string>('users.disconnect');
