import { type Types } from '@graphql-codegen/plugin-helpers';
import { type TypeScriptTypedDocumentNodesConfig } from '@graphql-codegen/typed-document-node';
import { type TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import { type TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import * as dotenv from 'dotenv';
import { type IGraphQLConfig } from 'graphql-config';

const apiEnv = dotenv.config({ path: `${__dirname}/api/.env` }).parsed ?? {};
// const clientEnv = dotenv.config({ path: `${__dirname}/client/.env` }).parsed ?? {};

const codegen: Types.Config = {
	generates: {
		'client/src/graphql/@generated/index.ts': {
			plugins: [
				{
					typescript: {} as TypeScriptPluginConfig,
				},
				{
					'typescript-operations': {
						useTypeImports: true,
					} as TypeScriptDocumentsPluginConfig,
				},
				{
					'typed-document-node': {
						useTypeImports: true,
					} as TypeScriptTypedDocumentNodesConfig,
				},
			],
		},
	},
};

const config: IGraphQLConfig = {
	schema: `http://localhost:${apiEnv.PORT ?? 3000}/graphql`,
	documents: 'client/src/graphql/**/*.graphql',
	extensions: {
		codegen,
	},
};

export default config;
