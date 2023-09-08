import { themeCookieName, themes } from '$/lib/stores';
import { LogoutStore } from '$houdini';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
	async logout({
		locals: {
			gql: { mutate },
		},
	}) {
		const result = await mutate(LogoutStore, null);

		if (result.type === 'failure') {
			return;
		}

		throw redirect(StatusCodes.SEE_OTHER, '/login');
	},
	async theme({ cookies, url: { searchParams } }) {
		const theme = searchParams.get('value');

		if (theme === 'null') {
			cookies.delete(themeCookieName);

			return {};
		}

		if (!theme || !(themes as unknown as string[]).includes(theme)) {
			throw fail(StatusCodes.BAD_REQUEST);
		}

		cookies.set(themeCookieName, theme, {
			expires: new Date('01 Jan 9999'),
			httpOnly: false,
		});

		return {};
	},
} satisfies Actions;
