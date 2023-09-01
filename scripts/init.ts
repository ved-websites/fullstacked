import { exec as execNoPromise } from 'child_process';
import util from 'util';
import { setupRenovate } from './subscripts/file-changes.js';
import { setupProjectName } from './subscripts/project-name.js';
import { setupEnvs } from './subscripts/setup-envs.js';
import { getCliArgs } from './utils/args.js';
import { progresser } from './utils/index.js';

const exec = util.promisify(execNoPromise);

const { args } = getCliArgs();

// =====================
//  Setup Generic Files
// =====================

await progresser('Setting up renovate', setupRenovate);

// =====================
//      Setup Envs
// =====================

await progresser('Setting up env vars', setupEnvs);

// =====================
//       Init API
// =====================

if (!args.some(({ name }) => name == 'no-api')) {
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

	await progresser('Setting up api', async () => {
		await exec('pnpm run --filter ./api init');
		await exec('pnpm run gql');
	});
} else if (!args.some(({ name }) => name == 'no-gql')) {
	// If not setting API, at least check for GraphQL generation
	await progresser('Setting up GraphQL', () => exec('pnpm run --filter ./api gql:generate'));
}

// =====================
//      Init Client
// =====================

if (!args.some(({ name }) => name == 'no-client')) {
	await progresser('Setting up client', () => exec('pnpm run --filter ./client sync'));
}

// No need to setup project name in CI
if (!process.env.CI) {
	await setupProjectName();
}

console.log('Done! Enjoy your new project :)');
