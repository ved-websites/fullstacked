export interface Toggleable<T = void> {
	toggle(): T;
}

export function useToggleable<O, T = void>(object: O, toggler: (object: O) => T): O & Toggleable<T> {
	Object.defineProperty(object, 'toggle', {
		value: () => toggler(object),
		writable: false,
		enumerable: false,
		configurable: false,
	});

	return object as O & Toggleable<T>;
}
