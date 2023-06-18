import fs from 'fs';
import { copyFile } from 'fs/promises';
import replace from 'replace-in-file';
import { generateGuid } from '../utils/index.js';

const { replaceInFile } = replace;

async function setupAPI() {
	const folder = './api';

	if (fs.existsSync(`${folder}/.env`)) {
		return;
	}
	if (!fs.existsSync(`${folder}/.env.example`)) {
		return;
	}

	await copyFile(`${folder}/.env.example`, `${folder}/.env`);

	await replaceInFile({
		files: ['./api/.env'],
		from: 'MY_RANDOM_KEY',
		to: generateGuid(),
	});
}

async function setupClient() {
	const folder = './client';

	if (fs.existsSync(`${folder}/.env`)) {
		return;
	}
	if (!fs.existsSync(`${folder}/.env.example`)) {
		return;
	}

	await copyFile(`${folder}/.env.example`, `${folder}/.env`);
}

export async function setupEnvs() {
	return Promise.all([setupAPI(), setupClient()]);
}
