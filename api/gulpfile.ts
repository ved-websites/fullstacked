import { exec as execNoPromise } from 'child_process';
import del from 'del';
import fs from 'fs';
import gulp, { type TaskFunction } from 'gulp';
import util from 'util';
import { generate as generatePrisma, pushDb, seedDb } from './prisma/utils/functions';

const exec = util.promisify(execNoPromise);

// CONFIGS

export const configs = {
	buildDest: './dist',
	uploadsFolder: './uploads',
	devPort: 3005,
	prismaGeneratedFolder: 'src/_generated',
};

// TASKS

// Build Tasks

function buildNest() {
	return exec('pnpm exec nest build');
}

function buildPrisma() {
	return gulp.src(['./prisma/schema.prisma', './prisma/migrations/**/*'], { base: '.' }).pipe(gulp.dest(configs.buildDest));
}

// Creation Tasks

function setupEnv() {
	const devEnvName = '.env';

	if (!fs.existsSync(devEnvName)) {
		throw `Project not initialized! Make sure to run "pnpm run init" in the project's folder root.`;
	}

	return Promise.resolve();
}

function generateGraphQLSchema() {
	return exec('pnpm exec nest start --entryFile="@common/graphql/schema/generate-schema"', {
		env: {
			...process.env,
			LOCAL: 'true',
		},
	});
}

function generatePrismaHelpers() {
	return generatePrisma();
}

function updateDatabaseSchema() {
	return pushDb({ skipGenerators: true, forceReset: true });
}

async function seedDatabase() {
	const outputs = await seedDb();

	console.log(outputs.stdout);

	return outputs;
}

// Delete tasks

function deleteDist() {
	return del(configs.buildDest);
}

// function deleteUploads() {
// 	return del(configs.uploadsFolder);
// }

function deletePrismaGenerated() {
	return del(configs.prismaGeneratedFolder);
}

// ------------------------
// |     Gulp Commands    |
// ------------------------

// COMBINES

export const setupPrisma: TaskFunction = gulp.series(deletePrismaGenerated, generatePrismaHelpers, generateGraphQLSchema);

export const setupPrismaFull: TaskFunction = gulp.series(setupPrisma, updateDatabaseSchema);

export const build: TaskFunction = gulp.series(gulp.parallel(deleteDist, setupPrisma), buildNest, buildPrisma);

export const init: TaskFunction = gulp.series(deleteDist, setupEnv, setupPrismaFull, generateGraphQLSchema);

export const cleanBuild: TaskFunction = gulp.series(init, build);

export const cleanDb: TaskFunction = gulp.series(setupEnv, updateDatabaseSchema);

export const seed: TaskFunction = seedDatabase;

export const cleanSeed: TaskFunction = gulp.series(cleanDb, seedDatabase);

// Useful commands

export { deleteDist, generateGraphQLSchema, setupEnv };
