import type { HelperOptions } from 'handlebars';

export type HelperArgs<T extends unknown[] = unknown[]> = [values: T, options: HelperOptions];

export function extractValuesAndOptions<T extends unknown[] = unknown[]>(args: unknown[]): HelperArgs<T> {
	if (args.length == 1) {
		return [[], args[0]] as unknown as HelperArgs<T>;
	}

	const values = args.slice(0, args.length - 1);
	const options = args[args.length - 1];

	return [values, options] as HelperArgs<T>;
}
