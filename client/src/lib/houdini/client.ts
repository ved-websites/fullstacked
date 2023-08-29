import { HoudiniClient } from '$houdini';
import { subscription } from '$houdini/plugins';
import { createClient as createWSClient } from 'graphql-ws';
import { getApiUrl } from '../utils';

const apiUrl = getApiUrl();

export default new HoudiniClient({
	url: `${apiUrl.origin}/graphql`,
	fetchParams({ session }) {
		if (!session?.token) {
			return {};
		}

		return {
			headers: {
				Authorization: `Bearer ${session.token}`,
				'apollo-require-preflight': 'true',
			},
		};
	},
	plugins: [
		subscription(({ session }) => {
			const wsProtocol = apiUrl.protocol == 'https:' ? 'wss' : 'ws';

			const wsClient = createWSClient({
				url: `${wsProtocol}://${apiUrl.host}/graphql`,
				connectionParams() {
					if (!session?.token) {
						return {};
					}

					return {
						Authorization: `Bearer ${session.token}`,
						'apollo-require-preflight': 'true',
					};
				},
			});

			return wsClient;
		}),
	],
});
