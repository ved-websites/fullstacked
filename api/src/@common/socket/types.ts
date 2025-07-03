import { UserContainer } from '$users/auth/types';
import type { WebSocket } from 'ws';

export type TypedWebSocket = WebSocket & UserContainer;
export type SocketOrSessionId = TypedWebSocket | string;
