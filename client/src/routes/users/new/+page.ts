/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

import { superValidateSync } from 'sveltekit-superforms/client';
import { userFormSchema } from '../components/userform.schema';
import type { BeforeLoadEvent } from './$houdini';

export function _houdini_beforeLoad(_: BeforeLoadEvent) {
	const form = superValidateSync(userFormSchema);

	return { form };
}
