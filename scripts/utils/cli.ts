export function getCliArgs() {
	const [executable, file, ...args] = process.argv;

	return {
		executable,
		file,
		args,
	};
}
