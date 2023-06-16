/// <reference types="@sveltejs/kit" />

export interface SessionData {
	'color-theme'?: import('./stores').Theme;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Locals {}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
