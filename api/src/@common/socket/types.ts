import type { WebSocket } from 'ws';
import type { LuciaContainer } from '../users/auth/lucia/types';

export type TypedWebSocket = WebSocket & LuciaContainer;
export type SocketOrSessionId = TypedWebSocket | string;
