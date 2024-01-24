/* eslint-disable @typescript-eslint/no-empty-interface */

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

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type Awaitable<T> = T | PromiseLike<T>;
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & unknown;

	namespace App {
		interface Locals extends AppLocals {}
		interface PageData extends AppPageData {}
		// interface Error {}
		// interface Platform {}
	}
}
