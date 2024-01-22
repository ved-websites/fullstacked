import type { User } from '$prisma-client';
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

		type DatabaseUserAttributes = Omit<User, 'id'>;
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
