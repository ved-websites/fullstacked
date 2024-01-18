import type { Auth as ApiAuth } from '$users/auth/lucia/lucia.factory';
import type { SessionContainer } from '$users/auth/lucia/lucia.middleware';
import type { AuthRequest } from 'lucia';
import type { I18nContext } from 'nestjs-i18n';

declare global {
	type Awaitable<T> = T | PromiseLike<T>;
	type Prettify<T> = {
		[K in keyof T]: T[K];
	} & unknown;

	declare namespace Lucia {
		type Auth = ApiAuth;

		type DatabaseUserAttributes = {
			email: string;
			firstName?: string | null;
			lastName?: string | null;
			registerToken?: string | null;
			profilePictureRef?: string;
			emailLang?: string;
		};
		// type DatabaseSessionAttributes = {};
	}

	declare namespace Express {
		interface Locals {
			authRequest: AuthRequest<ApiAuth>;
		}

		interface Request extends SessionContainer {
			i18nLang: string;
			i18nContext: I18nContext;
		}
	}
}

export {};
