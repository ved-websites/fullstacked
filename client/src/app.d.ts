import type { Client } from '@urql/svelte';
import type { getAuthUser } from './hooks.server';
import type { ClientUser } from './lib/utils/hooks-helper.server';

type ClientUser = Awaited<ReturnType<typeof getAuthUser>>;

type LayoutAlertLevel = 'info' | 'warning' | 'error';

type LayoutAlert = {
	text: string;
	/** The Alert behavior. Defaults to 'info'. */
	level?: LayoutAlertLevel;
	/** The icon path to use from `@mdj/js`. Defaults to level aware icon. */
	icon?: string;
};

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			urql: Client;
			sessionUser: ClientUser;
		}
		interface PageData {
			sessionUser: ClientUser;
			layoutAlert: LayoutAlert | undefined;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export { ClientUser, LayoutAlert, LayoutAlertLevel };
