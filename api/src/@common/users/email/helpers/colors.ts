import { extractValuesAndOptions } from './utils';

export type ColorString = `#${string}`;

export const colors = {
	black: '#000',
	white: '#fff',
	red: '#ff0000',
	blue: '#000fff',
	green: '#008000',
	yellow: '#ffff00',
	gray: '#808080',
	orange: '#ffa500',
	lightblue: '#add8e6',
} satisfies Record<string, ColorString>;

export function color(...args: unknown[]): ColorString {
	const [[value]] = extractValuesAndOptions(args);

	const colorName = value as keyof typeof colors;

	return colors[colorName] ?? colors.black;
}
