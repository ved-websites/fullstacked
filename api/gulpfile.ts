import { exec as execCallback } from 'child_process';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import { prompt } from 'gulp-prompt';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import ts from 'gulp-typescript';
import util from 'util';
import { generate as generatePrisma, pushDb, seedDb } from './prisma/functions';

const exec = util.promisify(execCallback);

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
	return exec('npx nest build');
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

function seedDatabase() {
	return seedDb();
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

export const build = gulp.series(deleteDist, buildNest, buildPrisma);

export const setupPrisma = gulp.series(deletePrismaGenerated, generatePrismaHelpers);

export const setupPrismaFull = gulp.series(setupPrisma, updateDatabaseSchema);

export const init = gulp.series(deleteDist, setupEnv, setupPrismaFull);

export const cleanBuild = gulp.series(init, build);

export const cleanDb = gulp.series(setupEnv, updateDatabaseSchema);

export const cleanSeed = gulp.series(cleanDb, seedDatabase);

// Useful commands

export { deleteDist };
