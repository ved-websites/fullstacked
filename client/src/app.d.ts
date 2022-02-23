/* eslint-disable @typescript-eslint/no-empty-interface */

/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	type Theme = import('./stores').Theme;

	export interface Locals {
		theme: Theme | null;
	}

	export interface Platform {}

	export interface Session {
		theme: Theme | null;
	}

	export interface Stuff {}
}
