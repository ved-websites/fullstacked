import { ContextService } from '$context/context.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

@Injectable()
export class SessionI18nResolver implements I18nResolver {
	resolve(context: ExecutionContext) {
		const { session } = ContextService.getRequest(context);

		if (!session) {
			return undefined;
		}

		return session.user.lang ?? undefined;
	}
}
