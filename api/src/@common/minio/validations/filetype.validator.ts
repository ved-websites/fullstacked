import { FileTypeValidator } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { ACCEPTED_PICTURE_TYPES } from '~shared';

export class VFileTypeValidator extends FileTypeValidator {
	constructor() {
		super({ fileType: new RegExp(`^image/(?:${ACCEPTED_PICTURE_TYPES.join('|')})$`) });
	}

	override buildErrorMessage(): string {
		const i18n = I18nContext.current();

		if (!i18n) {
			return super.buildErrorMessage();
		}

		return i18n.t('files.errors.upload.invalid.type', { args: { types: ACCEPTED_PICTURE_TYPES.join(', ') } });
	}
}
