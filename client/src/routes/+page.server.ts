import { themeCookieName, themes } from '$lib/stores';
import { assertTsRestActionResultOK } from '$lib/utils/assertions';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
	async logout({ locals: { tsrest } }) {
		return assertTsRestActionResultOK({
			layoutAlert: undefined,
			result: () => tsrest.auth.logout(),
			onValid: () => {
				redirect(StatusCodes.SEE_OTHER, '/login');
			},
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
