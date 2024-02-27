export function removeKeys<T extends Record<string, unknown>, K extends keyof T>(obj: T, ...keysToRemove: K[]): Omit<T, K> {
	const newObj = { ...obj };

	keysToRemove.forEach((key) => delete newObj[key]);

	return newObj;
}
