/* eslint-disable @typescript-eslint/no-magic-numbers */

export type Arg = {
	name: string;
	value?: string;
	type: 'arg' | 'value';
	pos: number;
};

export function formatRawArgs(rawArgs: string[]): Arg[] {
	function splitNameAndValue(arg: string) {
		if (arg.includes('=')) {
			const [name, value] = arg.split('=', 2) as [string, string];

			return { name, value };
		}

		return { name: arg };
	}

	const unFlattenArgs = rawArgs.map<Arg | Arg[]>((arg, pos) => {
		if (arg.startsWith('--')) {
			const formattedArg = arg.slice(2);

			return { ...splitNameAndValue(formattedArg), pos, type: 'arg' };
		}

		if (arg.startsWith('-')) {
			return arg
				.slice(1)
				.split('')
				.map((singleArg) => ({ name: singleArg, pos, type: 'arg' }));
		}

		return { ...splitNameAndValue(arg), pos, type: 'value' };
	});

	return unFlattenArgs.flat();
}

export function getCli() {
	const [executable, file, ...rawArgs] = process.argv;

	const args = formatRawArgs(rawArgs);

	function hasArg(arg: string) {
		return args.some(({ name }) => name === arg);
	}

	return {
		executable,
		file,
		args,
		rawArgs,
		hasArg,
	};
}
