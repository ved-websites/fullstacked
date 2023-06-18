export function capitalize(str: string): string {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

export function generateGuid() {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const dashPositions = [8, 12, 16, 20];
	const guidLength = 32;
	const hexSize = 16;

	return Array.from(Array(guidLength))
		.map((_v, index) => {
			const randomChar = Math.floor(Math.random() * hexSize)
				.toString(hexSize)
				.toUpperCase();

			return dashPositions.includes(index) ? `-${randomChar}` : randomChar;
		})
		.join('');
}
