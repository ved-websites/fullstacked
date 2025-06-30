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
	prismaGeneratedFolder: './src/_generated',
};

// TASKS

// Build Tasks

async function buildNest() {
	const outputs = await exec('pnpm exec nest build');

	if (outputs.stderr) {
		throw new Error(`Nest build failed: ${outputs.stderr}`);
	}
}

function buildPrisma() {
	return gulp
		.src([`${configs.prismaGeneratedFolder}/prisma/**/*`, `!${configs.prismaGeneratedFolder}/_generated/prisma/**/*.js`], { base: '.' })
		.pipe(gulp.dest(`${configs.buildDest}/_generated/prisma`));
}

// Creation Tasks

async function setupEnv() {
	const devEnvName = '.env';

	if (!fs.existsSync(devEnvName)) {
		throw `Project not initialized! Make sure to run "pnpm run init" in the project's folder root.`;
	}
}

async function generatePrismaHelpers() {
	const outputs = await generatePrisma();

	if (outputs.stderr) {
		throw new Error(`Prisma generation failed: ${outputs.stderr}`);
	}
}

async function updateDatabaseSchema() {
	const outputs = await pushDb({ skipGenerators: true, forceReset: true });

	if (outputs.stderr) {
		throw new Error(`Database push failed: ${outputs.stderr}`);
	}
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

export const setupPrisma: TaskFunction = gulp.series(deletePrismaGenerated, generatePrismaHelpers);

export const setupPrismaFull: TaskFunction = gulp.series(setupPrisma, updateDatabaseSchema);

export const build: TaskFunction = gulp.series(gulp.parallel(deleteDist, setupPrisma), buildNest, buildPrisma);

export const init: TaskFunction = gulp.series(deleteDist, setupEnv, setupPrismaFull);

export const initNoDbPush: TaskFunction = gulp.series(deleteDist, setupEnv, setupPrisma);

export const cleanBuild: TaskFunction = gulp.series(init, build);

export const cleanDb: TaskFunction = gulp.series(setupEnv, updateDatabaseSchema);

export const seed: TaskFunction = seedDatabase;

export const cleanSeed: TaskFunction = gulp.series(cleanDb, seedDatabase);

// Useful commands

export { deleteDist, setupEnv };
