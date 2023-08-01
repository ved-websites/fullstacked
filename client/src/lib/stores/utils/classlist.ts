import { writable, get } from 'svelte/store';

export type ClassListOptions = {
	/** Allows to unset defined classes on changes and on destroy. */
	unset: boolean;
};

function filterValues(values: string) {
	return values.split(' ').filter(Boolean);
}

/**
 * Svelte action to change class on any HTMLElement.
 *
 * @example
 *
 *```svelte
 * <svelte:body use:classList={"red green blue"} />
 *```
 
 Taken And adapted from https://github.com/ghostdevv/svelte-body
 */
export const classList = (node: HTMLElement, classString: string, options?: ClassListOptions) => {
	const opts: ClassListOptions = {
		unset: false,
		...(options ?? {}),
	};

	const classes = writable(filterValues(classString));

	// When the classes store changes add the new classes
	const unsubscribe = classes.subscribe((list) => {
		if (Array.isArray(list) && list?.length) node.classList.add(...list);
	});

	// Remove all classes that we added
	const unset = () => node.classList.remove(...get(classes));

	return {
		update: (classString?: string) => {
			if (classString != undefined) {
				unset();
				classes.set(filterValues(classString));
			} else {
				classes.update((value) => value);
			}
		},
		destroy: (forceUnset?: boolean) => {
			if (forceUnset || opts.unset) {
				unset();
			}
			unsubscribe();
		},
		unset: () => {
			unset();
		},
	};
};
