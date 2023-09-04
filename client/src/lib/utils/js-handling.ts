import type { Action } from 'svelte/action';

export const withJsParam = 'withJs';

export const formWithJs: Action = (element) => {
	if (!(element instanceof HTMLFormElement)) {
		throw 'Cannot use the action formWithJs on any other element than a form!';
	}

	const setupActionUrl: (event: HTMLElementEventMap['submit']) => unknown = (_event) => {
		const formHasAction = !!element.action.includes('?');

		const alreadyHasJsInActionRegex = new RegExp(`[?&]${withJsParam}`);

		if (!element.action.match(alreadyHasJsInActionRegex)) {
			element.action = `${element.action || ''}${formHasAction ? `&` : `?`}${withJsParam}`;
		}

		return true;
	};

	element.addEventListener('submit', setupActionUrl);

	return {
		destroy() {
			element.removeEventListener('submit', setupActionUrl);
		},
	};
};

export const HASJS_COOKIE_NAME = 'hasJs';
