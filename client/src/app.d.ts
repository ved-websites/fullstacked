/* eslint-disable @typescript-eslint/no-empty-interface */

import type { SessionUser } from './hooks.server';
import type { LayoutAlertData } from './lib/components/LayoutAlert/helper';
import type { ToastData } from './lib/components/ToastManager/helper';
import type { createHoudiniHelpers } from './lib/houdini/helper';
import type { Theme } from './lib/stores';

export interface AppLocals {
	gql: ReturnType<typeof createHoudiniHelpers>;
	sessionUser: SessionUser;
	theme?: Theme;
}

export interface AppPageData {
	sessionUser: SessionUser;
	layoutAlert: LayoutAlertData | undefined;
	toasts: ToastData[];
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
