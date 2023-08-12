import { schemaPath } from '$graphql/graphql.module';
import { NestFactory } from '@nestjs/core';
import { existsSync } from 'fs';
import { GQLGeneratorModule } from './helpers/generator.module';

export async function ensureGraphQLSchema() {
	if (!existsSync(schemaPath)) {
		// If schema file doesn't exist, run app once to generate schema
		const tempGqlApp = await NestFactory.create(GQLGeneratorModule);

		await tempGqlApp.init();
		await tempGqlApp.close();
	}
}
