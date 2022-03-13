/* eslint-disable @typescript-eslint/no-empty-interface */

/// <reference types="@sveltejs/kit" />

interface SessionData {
	theme: import('./stores').Theme;
}

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	type Theme = import('./stores').Theme;

	export interface Locals extends SessionData {}

	export interface Platform {}

	export interface Session extends SessionData {}

	export interface Stuff {}
}
