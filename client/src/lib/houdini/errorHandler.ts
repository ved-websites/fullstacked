import type { QueryResult } from '$houdini';
import { error, fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { SuperValidated } from 'sveltekit-superforms';
import { message } from 'sveltekit-superforms/client';
import { createToasts } from '../components/ToastManager/helper';
import { handleLoginRedirect } from '../utils/login';
import { createPageDataObject, type PageDataObject } from '../utils/page-data-object';

type KitHandlerFailure = [type: 'failure', params?: { code?: number; data?: PageDataObject }];
type KitHandlerFormMessage = [type: 'formMessage', params: { form: SuperValidated<never> }];
type KitHandlerRedirect = [type: 'redirect', params?: { status?: Parameters<typeof redirect>[0]; location?: `/${string}` }];
type KitHandlerError = [type: 'error', params?: { status?: Parameters<typeof error>[0]; body?: Parameters<typeof error>[1] }];
type KitHandlerCustom = [type: 'custom', handler: (data: { errors: QueryResult['errors'] }) => unknown];

export class GraphQLOperationFailure {
	readonly type = 'failure';
	readonly data = undefined;

	constructor(
		public errors: QueryResult['errors'],
		public event: RequestEvent,
	) {}

	kitHandler(...args: KitHandlerFailure): ReturnType<typeof fail>;
	kitHandler(...args: KitHandlerFormMessage): ReturnType<typeof message>;
	kitHandler(...args: KitHandlerRedirect): never;
	kitHandler(...args: KitHandlerError): never;
	kitHandler(...args: KitHandlerCustom): never;

	kitHandler(...args: KitHandlerFailure | KitHandlerFormMessage | KitHandlerRedirect | KitHandlerError | KitHandlerCustom): unknown {
		const [handlerType, params] = args;

		if (handlerType === 'failure') {
			return this.handleFailure(params);
		}

		if (handlerType === 'formMessage') {
			const { form } = params ?? {};

			const errorMessage = this.errors?.at(0)?.message;

			return message(form, errorMessage);
		}

		if (handlerType === 'redirect') {
			const { status = StatusCodes.SEE_OTHER, location = '/' } = params ?? {};

			if (this.errors?.some(({ message }) => message === 'UNAUTHENTICATED')) {
				throw redirect(status, handleLoginRedirect(this.event.url));
			}

			if (this.errors?.some(({ message }) => message === 'FORBIDDEN')) {
				const refererHeader = this.event.request.headers.get('referer');

				const forbiddenRedirect = `/?forbidden`;

				if (!refererHeader?.startsWith(this.event.url.origin)) {
					throw redirect(StatusCodes.SEE_OTHER, forbiddenRedirect);
				}

				const refererHeaderUrl = new URL(refererHeader);

				throw redirect(StatusCodes.SEE_OTHER, `${refererHeaderUrl.pathname}${forbiddenRedirect}`);
			}

			throw redirect(status, location);
		}

		if (handlerType === 'error') {
			const { status = StatusCodes.BAD_REQUEST, body } = params ?? {};

			const errorMessage = body ?? this.errors?.at(0)?.message;

			throw error(status, errorMessage);
		}

		if (handlerType === 'custom') {
			return params({ errors: this.errors });
		}

		throw new Error('woops');
	}

	protected handleFailure(params?: KitHandlerFailure[1]) {
		const { code = StatusCodes.BAD_REQUEST, data } = params ?? {};

		const toasts = createToasts(
			this.errors
				?.filter(({ message }) => !message.includes('Invalid'))
				.map(({ message }) => ({
					text: message,
					type: 'error',
				})),
		);

		return fail(code, createPageDataObject({ toasts, ...data }));
	}
}

export type GraphQLOperationSuccess<Data> = { data: Data; type: 'success' };
export type GraphQLOperationResult<Data> = GraphQLOperationFailure | GraphQLOperationSuccess<Data>;

export function handleHoudiniErrors(event: RequestEvent, { data, errors }: QueryResult) {
	if (!errors?.length && data) {
		return { data, type: 'success' } satisfies GraphQLOperationSuccess<typeof data>;
	}

	return new GraphQLOperationFailure(errors, event);
}
