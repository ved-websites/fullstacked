export type ValueGetter<T> = T | (() => T);

export function getValue<T>(value?: ValueGetter<T>): T | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (value instanceof Function) {
		return value();
	}

	return value;
}
