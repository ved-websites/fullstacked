import { createLayoutAlert, type LayoutAlertData } from '$lib/components/LayoutAlert/helper';
import { createToasts, type ToastData, type ToastManagerData } from '$lib/components/ToastManager/helper';
import { error, fail, type RequestEvent } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import type { Infer, SuperValidated } from 'sveltekit-superforms';
import type { AnyZodObject } from 'zod';
import { k } from '~shared';
import { createPageDataObject, type PageDataObject } from './page-data-object';

export type ValidResult<T extends { status: number }> = T extends { status: StatusCodes.OK } ? T : never;
export type InvalidResult<T extends { status: number }> = Exclude<T, { status: StatusCodes.OK }>;

export function assertTsRestResultOK<T extends { status: number }>(
	result: T,
	errorArgs?: (result: InvalidResult<T>) => Parameters<typeof error>,
): asserts result is ValidResult<T> {
	if (result.status !== StatusCodes.OK) {
		const definedErrorArgs = errorArgs?.(result as Exclude<T, { status: StatusCodes.OK }>) ?? [result.status as never];

		error(...definedErrorArgs);
	}
}

export type ActionNotValidData = {
	errorMessage: string;
	pageData:
		| {
				form: SuperValidated<Infer<AnyZodObject>> | undefined;
				layoutAlert: LayoutAlertData;
		  }
		| {
				form: SuperValidated<Infer<AnyZodObject>> | undefined;
				toasts: ToastData[];
		  };
};

export type AssertTsRestActionResultOKArgs<T extends { status: number }> = {
	form?: SuperValidated<Infer<AnyZodObject>>;
	event?: RequestEvent;
	result: () => Awaitable<T>;
	onValid: (result: ValidResult<T>) => Awaitable<PageDataObject>;
	onNotOk?: (result: InvalidResult<T>, data: ActionNotValidData) => Awaitable<unknown>;
} & ({ toast?: Partial<ToastManagerData> } | { layoutAlert: Partial<LayoutAlertData> });

export function assertTsRestActionResultOK<T extends { status: number; body: unknown }>(args: AssertTsRestActionResultOKArgs<T>) {
	// Define checking result function
	const checkValidResult = async () => {
		const result = await args.result();

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
						layoutAlert: createLayoutAlert({ text: errorMessage, type: 'error', ...args.layoutAlert }),
					});
				}

				return createPageDataObject({
					form: args.form,
					toasts: createToasts({ text: errorMessage, type: 'error', ...args.toast }),
				});
			})();

			const userDefinedError = await args.onNotOk?.(result as InvalidResult<T>, { errorMessage, pageData });

			if (userDefinedError) {
				return userDefinedError;
			}

			return fail(result.status, pageData);
		}

		const expectedResult = await args.onValid(result);

		if (args.event) {
			return redirect({ form: args.form, ...expectedResult }, args.event);
		}

		return expectedResult;
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
export function assertFormValid<T>(form: SuperValidated<Infer<AnyZodObject>>, onValid: () => Awaitable<T>) {
	if (!form.valid) {
		return fail(StatusCodes.BAD_REQUEST, { form });
	}

	return onValid();
}
