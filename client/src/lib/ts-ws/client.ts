import { getApiUrl } from '$lib/utils';
import { wsR } from '~contract';
import { initClient } from './initClient';

export const wsClient = initClient(wsR, {
	url: getApiUrl().href.replace('http', 'ws'),
});
