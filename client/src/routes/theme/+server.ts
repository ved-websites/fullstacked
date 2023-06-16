import type { RequestHandler } from './$types';

// export const GET = (async ({ locals }) => {
export const GET = (async () => {
	// await locals.session.update(({ 'color-theme': colorTheme }) => {
	// 	if (!colorTheme) {
	// 		return { 'color-theme': 'dark' };
	// 	}

	// 	if (colorTheme == 'light') {
	// 		return { 'color-theme': 'dark' };
	// 	}

	// 	return { 'color-theme': 'light' };
	// });

	return new Response('2345');
}) satisfies RequestHandler;
