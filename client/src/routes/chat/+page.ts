/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */

import { superValidateSync } from 'sveltekit-superforms/client';
import type { BeforeLoadEvent } from './$houdini';
import { schema } from './schema';

export function _houdini_beforeLoad(_: BeforeLoadEvent) {
	const form = superValidateSync(schema);

	return { form };
}
