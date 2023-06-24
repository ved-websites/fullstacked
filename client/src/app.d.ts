import type { Client } from '@urql/svelte';
import type { getUser } from './lib/utils/hooks-helper.server';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			client: Client;
			user: ReturnType<typeof getUser>;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
