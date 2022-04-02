import { PrismaClient } from '@prisma/client';
import { exec as execNoPromise } from 'child_process';
import { ImportFixtureOptions, importFixtures } from 'prisma-fixtures';
import util from 'util';

const exec = util.promisify(execNoPromise);

// Prisma Utils

export async function generate() {
	return exec(`pnpx prisma generate`);
}

export async function seedDb() {
	return exec(`pnpx prisma db seed`);
}

export type PushDbOptions = {
	skipGenerators: boolean;
	acceptDataLoss: boolean;
	forceReset: boolean;
};

export async function pushDb(options?: Partial<PushDbOptions>) {
	const mapping: Record<keyof PushDbOptions, string> = {
		skipGenerators: '--skip-generate',
		acceptDataLoss: '--accept-data-loss',
		forceReset: '--force-reset',
	};

	const entries = Object.entries(mapping) as Array<[keyof PushDbOptions, string]>;

	const optionsString = entries.reduce((acc, [key, option]) => {
		if (options?.[key]) {
			return `${acc} ${option}`;
		}

		return acc;
	}, '');

	return exec(`pnpx prisma db push${optionsString}`);
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
