import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService as NestI18nService } from 'nestjs-i18n';

// import { I18nTranslations } from './@generated/i18n.generated';
// Not used anymore until https://github.com/toonvanstrijp/nestjs-i18n/issues/582 is fixed.
// export class TypedI18nService extends NestI18nService<I18nTranslations> {

@Injectable()
export class TypedI18nService extends NestI18nService {
	// Empty class, just to get the typings and proper nest mapping.
	// This class is a representation of the project's I18nService
	// with the possibility of overwriting its methods via the factory.
}

export function TypedI18nServiceFactory(i18nService: NestI18nService) {
	const defaultTranslate = i18nService.translate.bind(i18nService);

	i18nService.translate = (key, options) => {
		const defaultOptions: typeof options = {
			...options,
			lang: options?.lang || I18nContext.current()?.lang,
		};

		return defaultTranslate(key, defaultOptions);
	};

	return i18nService;
}
