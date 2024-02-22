import { getApiUrl } from '$lib/utils';
import { wsR } from '~contract';
import { initClient } from './initClient';

const apiUrl = getApiUrl();

export const wsClient = initClient(wsR, {
	url: apiUrl.href,
	handshakeUrl: `/ws-handshake`,
});

export type WsClientType = typeof wsClient;
