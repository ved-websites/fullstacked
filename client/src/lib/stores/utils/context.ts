import { getContext, setContext } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';

export type StoreContextOptions<T> = {
	key: string;
	/** Allows to escape updating store values if the old and new data is the same. */
	equalityCheck: (currentVal: T, newVal: T) => boolean;
};

export function createStoreContext<T>(options?: Partial<StoreContextOptions<T>>) {
	const { key = `unnamed_context_store_${(Math.random() + 1).toString(36).substring(7)}`, equalityCheck = (c: T, n: T) => c === n } =
		options ?? {};

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

export function createContextRune<T>(options?: Partial<StoreContextOptions<T>>) {
	const { key = `unnamed_context_store_${(Math.random() + 1).toString(36).substring(7)}`, equalityCheck = (c: T, n: T) => c === n } =
		options ?? {};

	let state = $state<T>();

	const wrapper = {
		get current() {
			if (!state) {
				throw new Error('You did not set the context store yet. Use `setContext` to set it before accessing.');
			}

			return state;
		},
		set(value: T) {
			if (state !== undefined && equalityCheck(state, value)) {
				return;
			}

			state = value;

			setContext(key, state);
		},
	};

	return wrapper;
}
