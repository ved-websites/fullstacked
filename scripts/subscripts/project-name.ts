import fs from 'fs';
import { rename } from 'fs/promises';
import { stdin as input, stdout as output } from 'node:process';
import readline, { type Interface } from 'readline/promises';
import replace from 'replace-in-file';
import { capitalize } from '../utils/index.js';

const { replaceInFile } = replace;

// =====================
//     Get New Name
// =====================

async function getOldProjectName(rl: Interface) {
	if (fs.existsSync('fullstacked.code-workspace')) {
		return 'fullstacked';
	}

	const renameConfirmation = await rl.question('!!! This project has already been renamed! Do you still want to rename it? y/[n] : ');

	if (renameConfirmation != 'y') {
		console.log('Stopping renaming steps.');

		return;
	}

	const files = fs.readdirSync('.').filter((fn) => fn.endsWith('.code-workspace'));

	const workspaceFile = files[0];

	if (!workspaceFile) {
		throw 'Logic to find workspace file name failed, check your file permissions!';
	}

	console.log();

	return workspaceFile.replace('.code-workspace', '');
}

export async function replaceProjectNames() {
	const rl = readline.createInterface({ input, output, removeHistoryDuplicates: true });

	const oldProjectName = await getOldProjectName(rl);

	if (!oldProjectName) {
		rl.close();
		return {};
	}

	console.log(`~~~~~~`);
	console.log(`Starting procedures to rename most "${oldProjectName}" reference to new name.`);
	console.log(`Keep in mind that spaces will be replaced by "-" and the capitalisation will be handled automatically.`);
	console.log(`Once finished, your vscode window will probably reload as the workspace filename will be changed.`);
	console.log(`~~~~~~`);

	const nameController = new AbortController();

	rl.once('SIGINT', () => {
		console.log('\nCancelled renaming.');
		nameController.abort();
	});

	let projectName: string;

	try {
		const dirtyName = await rl.question('New project name (Ctrl-C to cancel) : ', { signal: nameController.signal });

		projectName = dirtyName.trim();
	} catch (error) {
		rl.close();
		return {};
	}

	if (!projectName) {
		rl.close();
		return {};
	}

	const cleanProjectName = projectName.toLowerCase().replaceAll(' ', '-');

	try {
		await replaceInFile({
			files: ['.devcontainer/devcontainer.json', './api/.env', './api/.env.example', './package.json'],
			from: oldProjectName,
			to: cleanProjectName,
			allowEmptyPaths: true,
		});

		await replaceInFile({
			files: [
				'./README.md',
				'./{api,client}/README.md',
				`${oldProjectName}.code-workspace`,
				'./api/src/@common/onboarding/onboarding.html',
			],
			from: new RegExp(capitalize(oldProjectName), 'g'),
			to: capitalize(projectName),
			allowEmptyPaths: true,
		});
	} catch (error) {
		console.error(`An error happened while replacing old project name in files! Check file permissions and try again.`);

		rl.close();

		throw error;
	}

	rl.close();

	return {
		oldProjectName,
		projectName,
		cleanProjectName,
	};
}

// =====================
//    Renaming Files
// =====================

export async function renameProjectFiles(oldProjectName: string, cleanProjectName: string) {
	await rename(`${oldProjectName}.code-workspace`, `${cleanProjectName}.code-workspace`);
}

// =====================
//        Helper
// =====================

export async function setupProjectName() {
	const { oldProjectName, cleanProjectName } = await replaceProjectNames();

	if (cleanProjectName) {
		await renameProjectFiles(oldProjectName, cleanProjectName);
	}
}
