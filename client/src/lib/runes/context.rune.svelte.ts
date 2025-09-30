import { page } from '$app/state';
import type { SessionUser } from '$auth/auth-handler';
import type { I18nInstanceType } from '$i18n-config';
import { reconstructUrl } from '$lib/utils/urls';
import { Context, Previous } from 'runed';

export interface ContextData {
	sessionUser: SessionUser;
	i18n: I18nInstanceType;
	previousPage: Previous<string>;
}

export const contextKeys = ['sessionUser', 'i18n'] as const satisfies (keyof ContextData)[];

const globalContext = new Context<ContextData | null>('globalContext');

export function setupContext(data: Pick<ContextData, (typeof contextKeys)[number]>) {
	const contextData = {} as ContextData;

	for (const contextKey of contextKeys) {
		if (contextKey in data) {
			// @ts-expect-error TS shenanigans to get confirmed data.
			contextData[contextKey] = data[contextKey];
		}
	}

	const previousPage = new Previous(() => reconstructUrl(page.url));

	contextData.previousPage = previousPage;

	const contextState = $state(contextData);

	globalContext.set(contextState);

	return contextState;
}

export function contextPublic() {
	const context = globalContext.getOr(null);

	if (!context) {
		throw new Error('Context not initialized. Please ensure that setupContext has been called before accessing the context.');
	}

	return context;
}

export function context(): Prettify<Omit<ContextData, 'sessionUser'> & { sessionUser: NonNullable<ContextData['sessionUser']> }> {
	const contextData = contextPublic();

	if (!contextData.sessionUser) {
		// Should not happen, but good for validation
		throw new Error('Session not found! Please ensure you are authenticated before accessing this resource.');
	}

	// @ts-expect-error TS shenanigans to get confirmed sessionUser data.
	return contextData;
}
