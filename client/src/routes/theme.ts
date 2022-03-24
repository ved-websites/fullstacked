import type { RequestHandler } from '@sveltejs/kit';

export const put: RequestHandler = async () => {
	return {
		body: {
			data: 'Hi there!'
		}
	};
};
