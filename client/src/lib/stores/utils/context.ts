import { getContext, setContext } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

export type StoreContextOptions<T> = {
	key: string;
	/** Allows to escape updating store values if the old and new data is the same. */
	equalityCheck: (currentVal: T, newVal: T) => boolean;
};

export function createStoreContext<T>(options?: Partial<StoreContextOptions<T>>) {
	const {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		key = `unnamed_context_store_${(Math.random() + 1).toString(36).substring(7)}`,
		equalityCheck = (c: T, n: T) => c === n,
	} = options ?? {};

	function getStore<StoreType extends T>() {
		return getContext(key) as Writable<StoreType>;
	}

	function setStore(storeValue: T) {
		const contextStore = getStore() as ReturnType<typeof getStore> | undefined;

		if (!contextStore) {
			const keyStoreContext = writable<T>(storeValue);

			setContext(key, keyStoreContext);

			return;
		}

		if (equalityCheck(get(contextStore), storeValue)) {
			return;
		}

		contextStore.set(storeValue);
	}

	return {
		getStore,
		setStore,
	};
}
