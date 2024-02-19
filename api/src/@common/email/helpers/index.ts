import { extractValuesAndOptions } from './utils';

export function helperMissing(...args: unknown[]) {
	const [params, options] = extractValuesAndOptions(args) as unknown as [unknown[], Record<string, unknown>];

	throw `Missing : ${options.name}(${JSON.stringify(params)})`;
}

export { color } from './colors';
export { array, format, object } from './data';
export { styles } from './html-easing';
export { newLinesToParagraphs } from './paragraphs';
export { previewRenderWhitespace } from './previewRenderWhitespace';
