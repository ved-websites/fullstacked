import { HoudiniClient } from '$houdini';
import { subscription } from '$houdini/plugins';
import { createClient as createWSClient } from 'graphql-ws';
import { getApiUrl } from '../utils';

const apiUrl = getApiUrl('/graphql');

function createHeaders(token?: string) {
	return {
		Authorization: `Bearer ${token}`,
		'apollo-require-preflight': 'true',
	} satisfies HeadersInit;
}

export default new HoudiniClient({
	url: apiUrl.href,
	fetchParams({ session }) {
		if (!session?.token) {
			return {};
		}

		return {
			headers: createHeaders(session.token),
		};
	},
	plugins: [
		subscription(({ session }) => {
			const wsClient = createWSClient({
				url: apiUrl.href.replace('http', 'ws'),
				connectionParams() {
					if (!session?.token) {
						return {};
					}

					return createHeaders(session.token);
				},
			});

			return wsClient;
		}),
	],
});
