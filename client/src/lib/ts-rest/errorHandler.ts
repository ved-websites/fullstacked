import { page } from '$app/stores';
import { createToasts } from '$lib/components/ToastManager/helper';
import type { PageMessages } from '$lib/types';
import { commonErrors, isCommonError, type ApiFetcherData, type CommonError } from '@app/contract';
import { error, type RequestEvent } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { getFlash } from 'sveltekit-flash-message/client';
import { redirect } from 'sveltekit-flash-message/server';
import type { ApiResponseHandlerOptions, ErrorPageMessagesData, OnErrorFunctionArgs } from './client';

function getErrorPageMessagesData(handler: ErrorPageMessagesData | undefined, args: OnErrorFunctionArgs) {
	if (!handler) {
		return;
	}

	if (typeof handler === 'function') {
		return handler(args);
	}

	return handler;
}

export function extractErrorMessageFromApiFetcherData(data: ApiFetcherData) {
	const body = data.body as Record<string, unknown>;

	const message = 'message' in body ? String(body.message) : JSON.stringify(data.body);

	return message;
}

export async function checkForApiErrors(data: ApiFetcherData, options?: ApiResponseHandlerOptions) {
	const {
		event,
		showErrorPageOnBadRequest = false,
		onBadRequest,
		autoRouteOtherErrors = true,
		errPageData: errorPageMessagesData,
	} = options ?? {};

	let isErrorHandled = false;

	if (isCommonError(data)) {
		if (data.status === StatusCodes.BAD_REQUEST) {
			const message = extractErrorMessageFromApiFetcherData(data);

			isErrorHandled = !!(await onBadRequest?.({ event, data, message }));

			if (!isErrorHandled) {
				routeError(data.status, data.body.message, {
					event,
					doThrowForPage: showErrorPageOnBadRequest,
					pageMessagesData: await getErrorPageMessagesData(errorPageMessagesData, { event, data, message }),
				});

				isErrorHandled = true;
			}
		} else if ((commonErrors as ReadonlyArray<number>).includes(data.status)) {
			await handleTsRestCommonError(data, options);

			isErrorHandled = true;
		}
	}

	const handleOtherErrors = data.status !== StatusCodes.OK && autoRouteOtherErrors;

	if (handleOtherErrors || data.status >= StatusCodes.INTERNAL_SERVER_ERROR) {
		const message = extractErrorMessageFromApiFetcherData(data);

		routeError(data.status, message, {
			event,
			pageMessagesData: await getErrorPageMessagesData(errorPageMessagesData, { event, data, message }),
		});

		isErrorHandled = true;
	}
}

export async function handleTsRestCommonError(data: ApiFetcherData<CommonError>, options?: ApiResponseHandlerOptions) {
	const { onCommonError, event, errPageData: errorPageMessagesData } = options ?? {};

	const message = extractErrorMessageFromApiFetcherData(data);

	const didHandle = !!(await onCommonError?.({ event, data, message }));

	if (didHandle) {
		return;
	}

	routeError(data.status, data.body.message, {
		event,
		pageMessagesData: await getErrorPageMessagesData(errorPageMessagesData, { data, event, message }),
	});
}

export type RouteErrorOptions = Partial<{
	event: RequestEvent;
	doThrowForPage?: boolean;
	pageMessagesData?: PageMessages;
}>;

export function routeError(status: number, message: string, options?: RouteErrorOptions) {
	const { event, doThrowForPage = true, pageMessagesData } = options ?? {};

	const errorToasts = createToasts([
		{
			text: message,
			type: 'error',
		},
	]);

	if (event) {
		if (event.locals.step === 'page' && doThrowForPage) {
			throw error(status, message);
		}

		if (event.locals.step === 'action') {
			return;
			// throw fail(status, {
			// 	toasts: errorToasts,
			// 	...pageMessagesData,
			// });
		}

		throw redirect(
			{
				toasts: errorToasts,
				...pageMessagesData,
			},
			event,
		);
	}

	if (doThrowForPage) {
		throw error(status, message);
	}

	const flash = getFlash(page);

	flash.update(($flash) => {
		if (!$flash) {
			$flash = {};
		}

		$flash = {
			toasts: errorToasts,
			...pageMessagesData,
		};

		return $flash;
	});
}
