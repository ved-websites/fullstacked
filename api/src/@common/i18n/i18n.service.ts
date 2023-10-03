import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService as NestI18nService } from 'nestjs-i18n';
import { I18nTranslations } from './@generated/i18n.generated';

@Injectable()
export class I18nService extends NestI18nService<I18nTranslations> {
	// Empty class, just to get the typings and proper nest mapping.
	// This class is a representation of the project's I18nService
	// with the possibility of overwriting its methods via the factory.
}

export function I18nServiceFactory(i18nService: NestI18nService) {
	const defaultTranslate = i18nService.translate.bind(i18nService);

	i18nService.translate = (key, options) => {
		const defaultOptions: typeof options = {
			lang: I18nContext.current()?.lang,
			...options,
		};

		return defaultTranslate(key, defaultOptions);
	};

	return i18nService;
}
