import { ParseFilePipe } from '@nestjs/common';
import { VFileTypeValidator } from './validations/filetype.validator';
import { VMaxFileSizeValidator } from './validations/max-size.validator';

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_COUNT = 10;

export const byteToMbRatio = 1000000;

export const FileValidationPipe = new ParseFilePipe({
	validators: [new VMaxFileSizeValidator(), new VFileTypeValidator()],
});
