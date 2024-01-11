/* eslint-disable @typescript-eslint/no-empty-interface */

import type { QueryResult as HoudiniQueryResult } from '../$houdini/runtime/lib';
import type { SessionUser } from './auth/auth-handler';
import type { createHoudiniHelpers } from './lib/houdini/helper';
import type { Theme } from './lib/stores';
import type { createTsRestClient } from './lib/ts-rest/client';
import type { EventStep, GraphQLError, PageMessages } from './lib/types';

export interface AppLocals {
	gql: ReturnType<typeof createHoudiniHelpers>;
	tsrest: ReturnType<typeof createTsRestClient>;
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

export interface HoudiniSession {
	token?: string;
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

		// Houdini
		interface Session extends HoudiniSession {}
	}
}

// Allow for Houdini errors to show extensions and other GraphQL error data.
declare module '$houdini' {
	export type QueryResult<_Data = GraphQLObject, _Input = GraphQLVariables> = Omit<HoudiniQueryResult<_Data, _Input>, 'errors'> & {
		errors: GraphQLError[] | null;
	};
}
