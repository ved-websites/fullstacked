/* eslint-disable @typescript-eslint/no-empty-interface */

/// <reference types="@sveltejs/kit" />

type NullableFields<T> = {
	[P in keyof T]: T[P] | null;
};

interface SessionData {
	theme: import('./stores').Theme;
}

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	export interface Locals extends NullableFields<SessionData> {}

	export interface Platform {}

	export interface Session extends NullableFields<SessionData> {}

	export interface Stuff {}
}
