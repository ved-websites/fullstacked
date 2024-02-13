import { createToasts } from '$lib/components/ToastManager/helper';
import type { PageMessages } from '$lib/types';
import { flashStore } from '$lib/utils/flash';
import { commonErrors, isCommonError, type ApiFetcherData, type CommonError } from '@app/contract';
import { error, type RequestEvent } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
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

export async function extractErrorMessageFromApiFetcherData(data: ApiFetcherData) {
	const body = data.body as Record<string, unknown> | Blob;

	const message = body instanceof Blob ? await body.text() : 'message' in body ? String(body.message) : JSON.stringify(data.body);

	return message;
}

export async function checkForApiErrors(data: ApiFetcherData, options?: ApiResponseHandlerOptions) {
	if (options?.skipErrorHandling) {
		return;
	}

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
			const message = await extractErrorMessageFromApiFetcherData(data);

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

		return;
	}

	const handleOtherErrors = data.status !== StatusCodes.OK && autoRouteOtherErrors;

	if (handleOtherErrors || data.status >= StatusCodes.INTERNAL_SERVER_ERROR) {
		const message = await extractErrorMessageFromApiFetcherData(data);

		routeError(data.status, message, {
			event,
			pageMessagesData: await getErrorPageMessagesData(errorPageMessagesData, { event, data, message }),
		});

		isErrorHandled = true;
	}
}

export async function handleTsRestCommonError(data: ApiFetcherData<CommonError>, options?: ApiResponseHandlerOptions) {
	const { onCommonError, event, errPageData: errorPageMessagesData } = options ?? {};

	const message = await extractErrorMessageFromApiFetcherData(data);

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

	const errorToasts = createToasts({
		text: message,
		type: 'error',
	});

	if (event) {
		if (event.locals.step === 'page' && doThrowForPage) {
			error(status as never, message);
		}

		if (event.locals.step === 'action') {
			return;
		}

		if (event.locals.step === 'resolved') {
			return;
		}

		redirect(
			{
				toasts: errorToasts,
				...pageMessagesData,
			},
			event,
		);
	}

	if (doThrowForPage) {
		error(status as never, message);
	}

	const flash = flashStore();

	flash?.update(($flash) => {
		$flash = {
			toasts: errorToasts,
			...pageMessagesData,
		};

		return $flash;
	});
}
