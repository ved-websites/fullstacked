/* eslint-disable @typescript-eslint/no-magic-numbers */

import path from 'path';

export function getCallerFilePath(depth = 0) {
	const stack = new Error().stack!.split('\n');

	const callSite = stack[depth + 2]!;

	const filePath = callSite.match(/\(([^)]+):\d+:\d+\)/)![1]!;

	return filePath;
}

export function resolveRelativePath(filepath: string, depth = 0) {
	const callerPath = getCallerFilePath(depth + 1);
	const directory = path.dirname(callerPath);
	const resolvedPath = path.resolve(directory, filepath);

	return resolvedPath;
}
