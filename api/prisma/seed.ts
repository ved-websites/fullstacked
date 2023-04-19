import { seed } from './functions';

async function runCliSeeds() {
	const seedData = await seed();

	const formattedData = seedData.map((data) => ({
		Seeder: data.name,
		'Models Count': data.models.length,
	}));

	const seedersName = seedData.map((data) => data.name);
	const maxSeederLength = Math.max(...seedersName.map((el) => el.length));

	const spacingStartCount = Math.max(1, Math.floor(maxSeederLength / 2) - 1);
	const spacingEndCount = Math.max(1, Math.round(maxSeederLength / 2) - 1);

	const spacingStart = ` `.repeat(spacingStartCount);
	const spacingEnd = ` `.repeat(spacingEndCount);

	const tableHeader = `Seed data, ordered by run order`;

	const assumedLength = tableHeader.length - 2;

	const topBar = `─`.repeat(Math.max(assumedLength + 4, assumedLength + maxSeederLength));

	console.log();
	console.log(`┌${topBar}┐`);
	console.log(`|${spacingStart}${tableHeader}${spacingEnd}|`);
	console.table(formattedData);
}

runCliSeeds();
