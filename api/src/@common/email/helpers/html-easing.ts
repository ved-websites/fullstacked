import type CSS from 'csstype';
import { extractValuesAndOptions } from './utils';

export function styles(...args: unknown[]) {
	const [[properties, defaults]] = extractValuesAndOptions<[CSS.Properties, CSS.Properties]>(args);

	if (!properties && !defaults) {
		return '';
	}

	const mergedConfig = {
		...defaults,
		...properties,
	};

	const fontFamily =
		(mergedConfig.fontFamily as unknown) === true
			? '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
			: mergedConfig.fontFamily;

	// merge styles to defaults and remove null styles
	const computedStyles = Object.fromEntries(
		Object.entries({
			...mergedConfig,
			fontFamily,
		}).filter(([_, v]) => !!v || v === 0),
	);

	const styleString = Object.entries(computedStyles)
		.map(([key, value]) => {
			const formattedKey = key
				.split(/(?=[A-Z])/)
				.join('-')
				.toLowerCase();

			return `${formattedKey}:${value}`;
		})
		.join(';');

	return styleString;
}
