import type { User } from '$prisma-client';
import type { Auth as ApiAuth } from '$users/auth/lucia/lucia.factory';
import type { LuciaContainer } from '$users/auth/lucia/lucia.middleware';
import type { I18nContext } from 'nestjs-i18n';

declare module 'lucia' {
	interface Register {
		Lucia: ApiAuth;
		DatabaseUserAttributes: User;
		// DatabaseSessionAttributes: {};
	}
}

declare global {
	type Awaitable<T> = T | PromiseLike<T>;
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & unknown;

	type I18nKey = string;

	declare namespace Express {
		interface Request extends LuciaContainer {
			i18nLang: string;
			i18nContext: I18nContext;
		}
	}
}

export {};
