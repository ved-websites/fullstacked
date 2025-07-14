import type { SessionUser } from '$auth/auth-handler';
import type { I18nInstanceType } from '$i18n-config';
import { Context } from 'runed';

export interface ContextData {
	sessionUser: SessionUser;
	i18n: I18nInstanceType;
}

export const globalContext = new Context<ContextData>('globalContext');

export function contextPublic() {
	return globalContext.get();
}

export function context(): Prettify<Omit<ContextData, 'sessionUser'> & { sessionUser: NonNullable<ContextData['sessionUser']> }> {
	const contextData = contextPublic();

	if (!contextData.sessionUser) {
		// Should not happen, but good for validation
		throw new Error('Session not found! Please ensure you are authenticated before accessing this resource.');
	}

	// @ts-expect-error TS shenanigans to get confirmed sessionUser data.
	return globalContext.get();
}
