export interface Toggleable<T = void> {
	toggle(): T;
}

export function useToggleable<W, T = void>(object: W, toggler: (object: W) => T): typeof object & Toggleable<T> {
	return {
		toggle: () => toggler(object),
		...object,
	};
}
