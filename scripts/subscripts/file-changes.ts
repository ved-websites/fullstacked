import replace from 'replace-in-file';

const { replaceInFile } = replace;

export async function setupRenovate() {
	try {
		await replaceInFile({
			files: ['.github/renovate.json'],
			from: '"enabled": false',
			to: '"enabled": true',
			allowEmptyPaths: true,
		});
	} catch (error) {
		console.error(`An error happened while replacing old project name in files! Check file permissions and try again.`);

		throw error;
	}
}
