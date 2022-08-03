import { exec as execNoPromise } from 'child_process';
import del from 'del';
import dotenv from 'dotenv';
import fs from 'fs';
import gulp, { type TaskFunction } from 'gulp';
import { prompt } from 'gulp-prompt';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import ts from 'gulp-typescript';
import util from 'util';
import { generate as generatePrisma, pushDb, seedDb } from './prisma/functions';

const exec = util.promisify(execNoPromise);

// CONFIGS

const tsProject = ts.createProject('./tsconfig.json');

export const configs = {
	buildDest: (tsProject.config.compilerOptions?.outDir as string) || './dist',
	uploadsFolder: './uploads',
	devPort: 3005,
	prismaGeneratedFolder: 'src/_generated',
};

// UTILS

function generateGuid() {
	const dashPositions = [8, 12, 16, 20];

	return Array.from(Array(32))
		.map((_v, index) => {
			const randomChar = Math.floor(Math.random() * 16)
				.toString(16)
				.toUpperCase();

			return dashPositions.includes(index) ? `-${randomChar}` : randomChar;
		})
		.join('');
}

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
		let stream = gulp
			.src('./.env.example')
			.pipe(replace('MY_RANDOM_KEY', generateGuid()))
			.pipe(replace('PORT=', `PORT=${configs.devPort}`))
			.pipe(rename(devEnvName))
			.pipe(gulp.dest('.'));

		if (!process.env.DATABASE_URL) {
			stream = stream.pipe(
				prompt({
					type: 'input',
					name: 'confirmation',
					message: 'A new env file was created! Go fill the db connection info and press enter to continue.',
				}),
			);
		}

		stream.once('end', () => dotenv.config());

		return stream;
	}

	return Promise.resolve();
}

function generatePrismaHelpers() {
	return generatePrisma();
}

function updateDatabaseSchema() {
	return pushDb({ skipGenerators: true });
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

export const cleanBuild: TaskFunction = gulp.series(init, build);

export const cleanDb: TaskFunction = gulp.series(setupEnv, updateDatabaseSchema);

export const seed: TaskFunction = seedDatabase;

export const cleanSeed: TaskFunction = gulp.series(cleanDb, seedDatabase);

// Useful commands

export { deleteDist };
