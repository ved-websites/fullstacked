/* eslint-disable @typescript-eslint/no-magic-numbers */

export function getCallerFilePath(depth = 0) {
	const stack = new Error().stack!.split('\n');

	const callSite = stack[depth + 2]!;

	const filePath = callSite.match(/\(([^)]+):\d+:\d+\)/)![1]!;

	return filePath;
}
