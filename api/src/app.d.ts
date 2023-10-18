import type { Auth as ApiAuth } from '$users/auth/lucia/lucia.factory';
import type { AuthRequest, Session } from 'lucia';
import { I18nContext } from 'nestjs-i18n';

declare global {
	declare namespace Lucia {
		type Auth = ApiAuth;

		type DatabaseUserAttributes = {
			email: string;
			firstName?: string;
			lastName?: string;
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

		interface Request {
			session: Session | null;
			sessionId: string | null;
			i18nLang: string;
			i18nContext: I18nContext;
		}
	}
}

export {};
