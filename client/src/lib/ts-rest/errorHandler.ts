import type { AppErrorBody } from '$app-types';
import { createToasts } from '$lib/components/ToastManager/helper';
import type { PageMessages } from '$lib/types';
import { extractFlashMessageFromEvent, flashStore } from '$lib/utils/flash';
import { commonErrors, isCommonError, type ApiFetcherData, type CommonError } from '@app/contract';
import { error, type RequestEvent } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import { redirect } from 'sveltekit-flash-message/server';
import type { ZodError } from 'zod';
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

export function extractErrorMessageFromApiFetcherData(data: ApiFetcherData): AppErrorBody | Promise<AppErrorBody> {
	const body = data.body as Record<string, unknown> | Blob;

	if (body instanceof Blob) {
		return body.text();
	}

	if ('message' in body) {
		return String(body.message);
	}

	if ('queryResult' in body) {
		const { issues } = body.queryResult as { issues: ZodError['issues'] };

		if (issues.length === 1) {
			return {
				message: 'common.errorpage.query.single' satisfies I18nKey,
				i18nPayload: { error: issues[0]!.message },
			};
		}

		return {
			message: 'common.errorpage.query.multiple' satisfies I18nKey,
			i18nPayload: { errors: issues.map((issue) => issue.message).join(', ') },
		};
	}

	return JSON.stringify(data.body);
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
				routeError(data.status, message, {
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

export function routeError(status: number, message: string | App.Error, options?: RouteErrorOptions) {
	const { event, doThrowForPage = true, pageMessagesData } = options ?? {};

	const errorToasts = createToasts({
		text: typeof message === 'string' ? message : message.message,
		type: 'error',
		i18nPayload: typeof message === 'object' ? message.i18nPayload : undefined,
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

		const flash = extractFlashMessageFromEvent(event);

		const isFromRedirect = 'isFromRedirect';

		if (flash?.[isFromRedirect]) {
			error(status as never, message);
		} else {
			redirect(
				{
					toasts: errorToasts,
					...pageMessagesData,
					[isFromRedirect]: true,
				},
				event,
			);
		}
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
