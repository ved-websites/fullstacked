/* eslint-disable @typescript-eslint/no-empty-interface */

import type { QueryResult as HoudiniQueryResult } from '../$houdini/runtime/lib';
import type { SessionUser } from './auth/auth-handler';
import type { LayoutAlertData } from './lib/components/LayoutAlert/helper';
import type { ToastData } from './lib/components/ToastManager/helper';
import type { createHoudiniHelpers } from './lib/houdini/helper';
import type { Theme } from './lib/stores';

export interface AppLocals {
	gql: ReturnType<typeof createHoudiniHelpers>;
	sessionUser: SessionUser;
	theme?: Theme;
	userHasJs: boolean;
}

export interface AppPageData {
	sessionUser: SessionUser;
	layoutAlert: LayoutAlertData | undefined;
	toasts: ToastData[];
	userHasJs: boolean;
}

export interface HoudiniSession {
	token?: string;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals extends AppLocals {}
		interface PageData extends AppPageData {}
		// interface Error {}
		// interface Platform {}

		// Houdini
		interface Session extends HoudiniSession {}
	}
}

export type GraphQLError = {
	message: string;
	locations: {
		line: number;
		column: number;
	}[];
	path: string[];
	extensions: {
		code: string;
		stacktrace: string[];
		originalError: {
			message: string;
			error: string;
			statusCode: number;
		};
	};
};

// Allow for Houdini errors to show extensions and other GraphQL error data.
declare module '$houdini' {
	export type QueryResult<_Data = GraphQLObject, _Input = GraphQLVariables> = Omit<HoudiniQueryResult<_Data, _Input>, 'errors'> & {
		errors: GraphQLError[] | null;
	};
}
