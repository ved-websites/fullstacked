/// <reference types="@sveltejs/kit" />

import type { Client } from '@urql/svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			client: Client;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
