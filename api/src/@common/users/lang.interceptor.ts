import { ContextService } from '$context/context.service';
import { PrismaService } from '$prisma/prisma.service';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { LuciaUser } from './auth/session.decorator';

@Injectable()
export class LangInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LangInterceptor.name);

	constructor(private readonly prisma: PrismaService) {}

	intercept(context: ExecutionContext, next: CallHandler) {
		const { i18nLang, session } = ContextService.getRequest(context);

		if (i18nLang && session) {
			this.handleEmailLang(i18nLang, session.user);
		}

		return next.handle();
	}

	async handleEmailLang(lang: string, user: LuciaUser) {
		if (lang == user.emailLang) {
			return;
		}

		try {
			await this.prisma.user.update({
				data: {
					emailLang: lang,
				},
				where: {
					email: user.email,
				},
			});
		} catch (error) {
			this.logger.error(`Error updating emailLang of user "${user.email}"...`, error instanceof Error ? error.stack : undefined);
		}
	}
}
