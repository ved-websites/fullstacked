import type { Client } from '@urql/svelte';
import type { getAuthUser } from './hooks.server';
import type { ClientUser } from './lib/utils/hooks-helper.server';

export type ClientUser = Awaited<ReturnType<typeof getAuthUser>>;

export type LayoutAlertLevel = 'info' | 'warning' | 'error';

export type LayoutAlert = {
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
			client: Client;
			user: ClientUser;
		}
		interface PageData {
			user: ClientUser;
			layoutAlert: LayoutAlert | undefined;
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
