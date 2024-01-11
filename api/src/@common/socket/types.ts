import type { WebSocket } from 'ws';
import type { SessionContainer } from '../users/auth/lucia/types';

export type TypedWebSocket = WebSocket & SessionContainer;
export type SocketOrSessionId = TypedWebSocket | string;
