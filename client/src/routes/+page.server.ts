import { themeCookieName, themes } from '$lib/stores';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { fail, redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { Actions } from './$types';

export const actions = {
	async logout({ locals: { tsrest }, cookies }) {
		return assertTsRestActionResultOK({
			cookies,
			layoutAlert: {},
			result: () => tsrest.auth.logout(),
			onValid: () => ({ redirectTo: '/login' }),
		});
	},
	async theme({ cookies, url: { searchParams }, request }) {
		const theme = searchParams.get('value');

		const formData = await request.formData();
		const redirectTo = formData.get('redirectTo')?.toString() ?? '/';

		if (theme === 'null') {
			cookies.delete(themeCookieName, { path: '/' });

			redirect(StatusCodes.SEE_OTHER, redirectTo);
		}

		if (!theme || !(themes as unknown as string[]).includes(theme)) {
			throw fail(StatusCodes.BAD_REQUEST);
		}

		cookies.set(themeCookieName, theme, {
			path: '/',
			expires: new Date('01 Jan 9999'),
			httpOnly: false,
		});

		redirect(StatusCodes.SEE_OTHER, redirectTo);
	},
} satisfies Actions;
