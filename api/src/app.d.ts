import type { UserContainer } from '$users/auth/types';
import type { I18nContext } from 'nestjs-i18n';

declare global {
	type Awaitable<T> = T | PromiseLike<T>;
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & unknown;

	type I18nKey = string;

	declare namespace Express {
		interface Request extends UserContainer {
			i18nLang: string;
			i18nContext: I18nContext;
		}
	}
}

export {};
