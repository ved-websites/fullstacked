import { ContextService } from '$context/context.service';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

@Injectable()
export class SessionI18nResolver implements I18nResolver {
	resolve(context: ExecutionContext) {
		const user = ContextService.getUser(context);

		if (!user) {
			return undefined;
		}

		return user.lang ?? undefined;
	}
}
