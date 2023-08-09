import { PUBLIC_API_ADDR, PUBLIC_TITLE } from '$env/static/public';

export function capitalize(str: string): string {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

/**
 * Returns the path created using the env variable `PUBLIC_API_ADDR`.
 *
 * @param path The remaining path / query objects used to create the api path.
 * @returns The full path desired.
 */
export function getApiUrl(path?: string): URL {
	const apiServerAddr: string = PUBLIC_API_ADDR ?? 'http://localhost:3000';

	const pathUrl = path ?? '/';

	const url = new URL(pathUrl, apiServerAddr);

	return url;
}

export const appTitle = PUBLIC_TITLE ?? '';

export * from './svelteutils';
