import { I18nContext, I18nTranslator, TranslateOptions } from 'nestjs-i18n';
import { I18nPath } from './@generated/i18n.generated';

export class I18nException extends Error {
	get translation(): I18nPath {
		return this.message as I18nPath;
	}

	get args() {
		return this.tArgs;
	}

	constructor(
		key: I18nPath,
		private readonly tArgs?: TranslateOptions,
	) {
		super(key);
	}
}

export function getErrorMessage(error: unknown, service: I18nTranslator) {
	if (error instanceof I18nException) {
		return service.t(error.translation, { lang: I18nContext.current()?.lang, ...error.args }) as string;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return 'Unhandled exception.';
}
