import { extractValuesAndOptions } from './utils';

export function newLinesToParagraphs(...args: unknown[]) {
	const [[text]] = extractValuesAndOptions<[string]>(args);

	const paragraphs = text.split('\n');

	return paragraphs;
}
