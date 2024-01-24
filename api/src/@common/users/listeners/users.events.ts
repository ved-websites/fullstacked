import { LuciaSession } from '$users/auth/types';

export const USERS_ON_CONNECT_EVENT_KEY = 'users.connect';
export type USERS_ON_CONNECT_EVENT_TYPE = LuciaSession;

export const USERS_ON_DISCONNECT_EVENT_KEY = 'users.disconnect';
export type USERS_ON_DISCONNECT_EVENT_TYPE = LuciaSession;
