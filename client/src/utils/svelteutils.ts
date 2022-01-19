import { onMount } from 'svelte';

export function onMountPromise<T>(fn: () => PromiseLike<T> | T): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		onMount(async () => {
			try {
				const result = await fn();

				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	});
}
