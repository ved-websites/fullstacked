import { getApiUrl } from '$lib/utils';
import type { Readable } from 'svelte/store';
import { wsR } from '~contract';
import { initClient } from './initClient';

export const wsClient = initClient(wsR, {
	url: getApiUrl().href.replace('http', 'ws'),
});

export type WsClientType = typeof wsClient extends Readable<infer T> ? T : never;
