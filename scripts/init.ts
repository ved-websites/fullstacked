import { exec as execNoPromise } from 'child_process';
import util from 'util';
import { setupRenovate } from './subscripts/file-changes.js';
import { setupProjectName } from './subscripts/project-name.js';
import { setupEnvs } from './subscripts/setup-envs.js';
import { getCliArgs } from './utils/cli.js';

const exec = util.promisify(execNoPromise);

// =====================
//  Setup Generic Files
// =====================

process.stdout.write('Setting up renovate...');
await setupRenovate();
console.log(' Done!');

// =====================
//       Setup Envs
// =====================

process.stdout.write('Setting up env vars...');
await setupEnvs();
console.log(' Done!');

// =====================
//       Init API
// =====================

const { args } = getCliArgs();

if (!args.some((arg) => arg == '--no-api')) {
	try {
		const { stdout } = await exec(
			`if [ $(pgrep -f 'pnpm start:debug$' -d ' ') ] ; then echo Killing API process to allow for init to run properly. Remember to start it again / reload at the end! ; fi`,
		);

		if (stdout.trim().length != 0) {
			console.log(stdout.trim());
		}

		await exec(`kill $(pgrep -f 'pnpm start:debug$' -d ' ')`);
	} catch (error) {
		// Do nothing on api kill error
	}
	process.stdout.write('Setting up api...');

	await exec('pnpm run --filter ./api init');

	console.log(' Done!');
}
if (!args.some((arg) => arg == '--no-client')) {
	process.stdout.write('Setting up client...');

	await exec('pnpm run --filter ./client build');

	console.log(' Done!');
}

// No need to setup project name in CI
if (!process.env.CI) {
	await setupProjectName();
}

console.log('Done! Enjoy your new project :)');
