import type { Client } from '@urql/svelte';
import type { ClientUser } from './hooks.server';
import type { LayoutAlertData } from './lib/components/LayoutAlert/helper';
import type { ToastData } from './lib/components/ToastManager/helper';
import type { Theme } from './lib/stores';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			urql: Client;
			sessionUser: ClientUser;
			theme?: Theme;
		}
		interface PageData {
			sessionUser: ClientUser;
			layoutAlert: LayoutAlertData | undefined;
			toasts: ToastData[];
		}
		// interface Error {}
		// interface Platform {}
	}
}
