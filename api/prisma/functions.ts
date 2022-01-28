import { PrismaClient } from '@prisma/client';
import { exec as execNoPromise } from 'child_process';
import path from 'path';
import { ImportFixtureOptions, importFixtures } from 'prisma-fixtures';
import util from 'util';

const exec = util.promisify(execNoPromise);

// Prisma Utils

function getPrismaBinary() {
	const projectRoot: string[] = process.env.NODE_ENV == 'production' ? ['..'] : ['..', '..'];

	const prismaBinary = path.join(__dirname, ...projectRoot, 'node_modules', '.bin', 'prisma');

	return prismaBinary;
}

export async function generate() {
	const prismaBinary = getPrismaBinary();

	return exec(`${prismaBinary} generate`);
}

export type PushDbOptions = {
	skipGenerators: boolean;
	acceptDataLoss: boolean;
	forceReset: boolean;
};

export async function pushDb(options?: Partial<PushDbOptions>) {
	const opts: PushDbOptions = { ...{ skipGenerators: false, acceptDataLoss: false, forceReset: false }, ...(options ?? {}) };

	const mapping: Record<keyof PushDbOptions, string> = {
		skipGenerators: '--skip-generate',
		acceptDataLoss: '--accept-data-loss',
		forceReset: '--force-reset',
	};

	const entries = Object.entries(mapping) as Array<[keyof PushDbOptions, string]>;

	const optionsString = entries.reduce((acc, [key, option]) => {
		if (opts[key]) {
			return `${acc} ${option}`;
		}

		return acc;
	}, '');

	const prismaBinary = getPrismaBinary();

	return exec(`${prismaBinary} db push${optionsString}`);
}

export async function seedDb() {
	const prismaBinary = getPrismaBinary();

	return exec(`${prismaBinary} db seed`);
}

export async function prepareTestDb(options?: Partial<ImportFixtureOptions>) {
	// Run the migrations to ensure our schema has the required structure
	await pushDb({ skipGenerators: true, acceptDataLoss: true, forceReset: true });

	const testArgs: Partial<ImportFixtureOptions> = {
		...{
			fixturesPath: './tests/fixtures',
		},
		...options,
	};

	return seed(testArgs);
}

export function seed(options?: Partial<ImportFixtureOptions>) {
	return importFixtures({
		...{
			prisma: options?.prisma ?? new PrismaClient(),
		},
		...options,
	});
}
