import { error, fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { SuperValidated } from 'sveltekit-superforms';
import type { AnyZodObject } from 'zod';

export function assertTsRestResultOK<T extends { status: number }>(
	result: T,
	errorArgs?: Parameters<typeof error>,
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
): asserts result is T & { status: 200 } {
	if (result.status !== StatusCodes.OK) {
		const definedErrorArgs = errorArgs ?? [result.status];

		throw error(...definedErrorArgs);
	}
}

/**
 * Asserts that the given superform is valid. If not, returns a `fail`ed `ActionFailure`.
 *
 * You can put code for what happens when the form is valid in a callback.
 *
 * You **need** to return the value of this function or it will do nothing.
 * On valid form, the callback's return value will be used as this function's return value.
 */
export function assertFormValid<T>(form: SuperValidated<AnyZodObject>, onValid: () => PromiseLike<T> | T) {
	if (!form.valid) {
		return fail(StatusCodes.BAD_REQUEST, { form });
	}

	return onValid();
}
