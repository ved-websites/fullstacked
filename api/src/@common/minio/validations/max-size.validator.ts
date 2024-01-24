import { MAX_FILE_SIZE_MB, byteToMbRatio } from '$minio/minio-client.constants';
import { MaxFileSizeValidator } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class VMaxFileSizeValidator extends MaxFileSizeValidator {
	constructor() {
		super({ maxSize: MAX_FILE_SIZE_MB * byteToMbRatio });
	}

	override buildErrorMessage(): string {
		const i18n = I18nContext.current();

		if (!i18n) {
			return super.buildErrorMessage();
		}

		return i18n.t('files.errors.upload.invalid.size', { args: { size: MAX_FILE_SIZE_MB } });
	}
}
