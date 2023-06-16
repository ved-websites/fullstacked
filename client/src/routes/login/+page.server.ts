import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
// import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { superValidate } from 'sveltekit-superforms/server';
import { redirect } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';

const PASSWORD_MIN_LENGTH = 6;

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} chars!`),
});

export const load = (async () => {
	const form = await superValidate(schema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	// default: async ({ request, url }) => {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return { form };

		// const { email, password } = form.data;

		// const { error: sbError } = await supabase.auth.signInWithPassword({ email, password });

		// if (sbError) {
		// 	return message(form, 'Server error. Try again later.');
		// }

		// const redirectTo = url.searchParams.get('redirectTo');

		// if (redirectTo) {
		// 	// Successful login, go to redirectedTo Page
		// 	throw redirect(StatusCodes.SEE_OTHER, `/${redirectTo.slice(1)}`);
		// }

		// Successful login, go to Home Page
		throw redirect(StatusCodes.SEE_OTHER, '/');
	},
} satisfies Actions;
