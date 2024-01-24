import replace from 'replace-in-file';

const { replaceInFile } = replace;

export async function setupRenovate() {
	try {
		await replaceInFile({
			files: ['.github/renovate.json'],
			from: '"enabled": false,',
			to: '"enabled": true,',
			allowEmptyPaths: true,
		});
	} catch (error) {
		console.error(`An error happened while enabling Renovate! Check file permissions and try again.`);

		throw error;
	}
}

export async function setupReleasePlease() {
	try {
		await replaceInFile({
			files: ['.github/workflows/release.yml'],
			from: `if: false && github.event_name != 'workflow_dispatch'`,
			to: `if: github.event_name != 'workflow_dispatch'`,
			allowEmptyPaths: true,
		});
	} catch (error) {
		console.error(`An error happened while enabling Release-Please! Check file permissions and try again.`);

		throw error;
	}
}
