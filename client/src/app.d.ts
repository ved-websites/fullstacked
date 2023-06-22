import type { RequestEvent } from '@sveltejs/kit';
import type { Client, ClientOptions } from '@urql/svelte';
import type { getUser } from './lib/utils/hooks-helper.server';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			getClient: (event: RequestEvent, options?: ClientOptions) => Client;
			getUser: (event?: RequestEvent) => ReturnType<typeof getUser>;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
