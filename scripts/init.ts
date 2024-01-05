import { exec as execNoPromise } from 'child_process';
import util from 'util';
import { setupReleasePlease, setupRenovate } from './subscripts/file-changes.js';
import { setupEnvs } from './subscripts/setup-envs.js';
import { getCli } from './utils/cli.js';
import { progresser } from './utils/index.js';

const exec = util.promisify(execNoPromise);

const cli = getCli();

// =====================
//  Setup Generic Files
// =====================

await progresser('Setting up renovate', setupRenovate);
await progresser('Setting up release-please', setupReleasePlease);

// =====================
//      Setup Envs
// =====================

await progresser('Setting up env vars', setupEnvs);

// =====================
//       Init API
// =====================

if (!cli.hasArg('no-api')) {
	try {
		const { stdout } = await exec(
			`if [ "$(pgrep -f '[d]ebug-api.sh' -d ' ')" ] ; then echo Killing API process to allow for init to run properly. Remember to start it again / reload at the end! ; fi`,
		);

		if (stdout.trim().length != 0) {
			console.log(stdout.trim());
		}

		await exec(`kill $(pgrep -f '[d]ebug-api.sh' -d ' ')`);
	} catch (error) {
		// Do nothing on api kill error
	}

	const apiInitScript = cli.hasArg('no-db-push') ? 'init:no-db-push' : 'init';

	await progresser('Setting up api', async () => {
		await exec(`pnpm run --filter ./api ${apiInitScript}`);
		await exec('pnpm run gql');
	});
} else if (!cli.hasArg('no-gql')) {
	// If not setting API, at least check for GraphQL generation
	await progresser('Setting up GraphQL', () => exec('pnpm run --filter ./api gql:generate'));
}

// =====================
//      Init Client
// =====================

if (!cli.hasArg('no-client')) {
	await progresser('Setting up client', () => exec('pnpm run --filter ./client sync'));
}

console.log('Done! Enjoy your new project :)');
