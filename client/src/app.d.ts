import type { Client } from '@urql/svelte';
import type { getAuthUser } from './hooks.server';
import type { ClientUser } from './lib/utils/hooks-helper.server';
import type { LayoutAlert } from './lib/utils/layout-alert';

type ClientUser = Awaited<ReturnType<typeof getAuthUser>>;

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			urql: Client;
			sessionUser: ClientUser;
			userHasJS: boolean;
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
