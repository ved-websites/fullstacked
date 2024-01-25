import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	redirect(StatusCodes.MOVED_PERMANENTLY, '/settings/profile');
}) satisfies PageServerLoad;
