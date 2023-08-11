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

export async function progresser(text: string, func: () => unknown | Promise<unknown>) {
	const perfStart = `${text}-start`;
	const perfEnd = `${text}-end`;

	performance.mark(perfStart);

	process.stdout.write(`${text}...`);

	await func();

	performance.mark(perfEnd);

	const perf = performance.measure(text, perfStart, perfEnd);
	const duration = Math.floor(perf.duration);

	console.log(` Done! (${duration} ms)`);
}
