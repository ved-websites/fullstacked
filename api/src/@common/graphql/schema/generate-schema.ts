import 'reflect-metadata';

import { schemaPath } from '$graphql/graphql.module';
import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { ensureGraphQLSchema } from './schema.manager';

async function generateSchema() {
	await ensureGraphQLSchema();

	const destPathDir = join(process.cwd(), '../client/$houdini/graphql');

	await mkdir(destPathDir, { recursive: true });

	const destinationPath = join(destPathDir, 'generated-api-schema.gql');

	await copyFile(schemaPath, destinationPath);
}

generateSchema();
