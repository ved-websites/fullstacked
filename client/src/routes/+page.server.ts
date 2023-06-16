import { redirect, type Actions } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

export const actions = {
	async logout({ locals: _ }) {
		throw redirect(StatusCodes.SEE_OTHER, '/login');
	},
} satisfies Actions;
