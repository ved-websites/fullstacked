export interface Refreshable {
	refresh(): void;
}

export function useRefreshable<O>(object: O, onRefresh: (object: O) => void): O & Refreshable {
	Object.defineProperty(object, 'refresh', {
		value: () => onRefresh(object),
		writable: false,
		enumerable: false,
		configurable: false,
	});

	return object as O & Refreshable;
}
