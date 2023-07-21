import type { Client } from '@urql/svelte';
import type { ClientUser } from './hooks.server';
import type { LayoutAlert } from './lib/utils/layout-alert';

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
