/* eslint-disable @typescript-eslint/no-empty-object-type */

import type { Snippet } from 'svelte';
import type { SessionUser } from './auth/auth-handler';
import type { Theme } from './lib/stores';
import type { TsRestClient } from './lib/ts-rest/client';
import type { EventStep, PageMessages } from './lib/types';

export interface AppLocals {
	tsrest: TsRestClient;
	sessionUser: SessionUser;
	theme?: Theme;
	userHasJs: boolean;
	browserLang: string;
	step: EventStep;
}

export interface AppPageData extends PageMessages {
	sessionUser: SessionUser;
	userHasJs: boolean;
	flash?: PageMessages;
}

export interface AppError {
	i18nPayload?: Record<string, unknown>;
}
export type AppErrorBody = string | App.Error;

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	/**
	 * Util to easily create Svelte Snippet props.
	 *
	 * Set keys of type `void` to create a snippet with no args, or
	 * set keys with a typed array of the args given for this specific snippet.
	 */
	type SProps<S extends { [key: PropertyKey]: void | unknown[] } = {}> = {
		[K in keyof S]: S[K] extends void ? Snippet : Snippet<S[K]>;
	} & { [rest: PropertyKey]: unknown };

	type Awaitable<T> = T | PromiseLike<T>;
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & unknown;

	type I18nKey = string;

	namespace App {
		interface Locals extends AppLocals {}
		interface PageData extends AppPageData {}
		interface Error extends AppError {}
		// interface Platform {}
	}
}
