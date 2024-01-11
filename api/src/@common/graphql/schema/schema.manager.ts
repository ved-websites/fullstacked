import { setupApp } from '$app/setupApp';
import { schemaPath } from '$graphql/graphql.module';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { AppModule } from '~app-module';

/**
 * If schema file doesn't exist, run app once to generate schema
 */
export async function ensureGraphQLSchema() {
	if (!existsSync(schemaPath)) {
		const tempGqlApp = await NestFactory.create<NestExpressApplication>(AppModule);

		setupApp(tempGqlApp);

		await tempGqlApp.init();
		await tempGqlApp.close();
	}
}
