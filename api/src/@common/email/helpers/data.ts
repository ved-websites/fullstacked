import type { HelperOptions } from 'handlebars';
import { extractValuesAndOptions } from './utils';

export function object({ hash }: HelperOptions) {
	return hash;
}

export function array(...args: [...values: unknown[], options: HelperOptions]) {
	const [values] = extractValuesAndOptions(args);

	return values;
}

export function format(...args: unknown[]) {
	const [[text, ...params]] = extractValuesAndOptions<[string, ...(string | number)[]]>(args);

	let formatted = text as string;

	if (!params?.length) {
		return text;
	}

	params.forEach((param, index) => {
		const regexp = new RegExp(`\\{${index}\\}`, 'gi');

		formatted = formatted.replace(regexp, `${param}`);
	});

	return formatted;
}
