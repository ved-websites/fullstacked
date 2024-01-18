import { k } from '$i18n';
import { createLayoutAlert, type LayoutAlertData } from '$lib/components/LayoutAlert/helper';
import { createToasts, type ToastManagerData } from '$lib/components/ToastManager/helper';
import { error, fail } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { SuperValidated } from 'sveltekit-superforms';
import type { AnyZodObject } from 'zod';
import { createPageDataObject } from './page-data-object';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export type ValidResult<T extends { status: number }> = T & { status: 200 };

export function assertTsRestResultOK<T extends { status: number }>(
	result: T,
	errorArgs?: (result: Exclude<T, { status: StatusCodes.OK }>) => Parameters<typeof error>,
): asserts result is ValidResult<T> {
	if (result.status !== StatusCodes.OK) {
		const definedErrorArgs = errorArgs?.(result as Exclude<T, { status: StatusCodes.OK }>) ?? [result.status];

		throw error(...definedErrorArgs);
	}
}

export type AssertTsRestActionResultOKArgs<T> = {
	form?: SuperValidated<AnyZodObject>;
	result: () => Awaitable<T>;
} & ({ toast?: Partial<ToastManagerData> } | { layoutAlert: Partial<LayoutAlertData> });

export function assertTsRestActionResultOK<T extends { status: number; body: unknown }>(
	args: AssertTsRestActionResultOKArgs<T>,
	onValid: (result: ValidResult<T>) => Awaitable<unknown>,
) {
	const checkValidResult = async () => {
		const result = await args.result();

		console.log({ result });

		try {
			assertTsRestResultOK(result);
		} catch (error) {
			const errorMessage =
				result.body && typeof result.body === 'object' && 'message' in result.body
					? String(result.body.message)
					: k('common.errorpage.types.server.details.500');

			const pageData = (() => {
				if ('layoutAlert' in args) {
					return createPageDataObject({
						form: args.form,
						layoutAlert: createLayoutAlert({ text: errorMessage, level: 'error', ...args.layoutAlert }),
					});
				}

				return createPageDataObject({
					form: args.form,
					toasts: createToasts([{ text: errorMessage, type: 'error', ...args.toast }]),
				});
			})();

			return fail(result.status, pageData);
		}

		return onValid(result);
	};

	if (args.form) {
		return assertFormValid(args.form, checkValidResult);
	}

	return checkValidResult();
}

/**
 * Asserts that the given superform is valid. If not, returns a `fail`ed `ActionFailure`.
 *
 * You can put code for what happens when the form is valid in a callback.
 *
 * You **need** to return the value of this function or it will do nothing.
 * On valid form, the callback's return value will be used as this function's return value.
 */
export function assertFormValid<T>(form: SuperValidated<AnyZodObject>, onValid: () => Awaitable<T>) {
	if (!form.valid) {
		return fail(StatusCodes.BAD_REQUEST, { form });
	}

	return onValid();
}
