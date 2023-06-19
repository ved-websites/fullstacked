import { exec as execNoPromise } from 'child_process';
import util from 'util';
import { setupProjectName } from './subscripts/files.js';
import { setupEnvs } from './subscripts/setupEnvs.js';
import { getCliArgs } from './utils/cli.js';

const exec = util.promisify(execNoPromise);

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
	process.stdout.write('Setting up api...');

	await exec('pnpm run --filter ./api init');

	console.log(' Done!');
}

// No need to setup project name in CI
if (!process.env.CI) {
	await setupProjectName();
}
