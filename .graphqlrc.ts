import type { Types } from '@graphql-codegen/plugin-helpers';
import type { TypeScriptTypedDocumentNodesConfig } from '@graphql-codegen/typed-document-node';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type { RawTypesConfig } from '@graphql-codegen/visitor-plugin-common';
import type { IGraphQLConfig } from 'graphql-config';

const tsCommonConfig: RawTypesConfig = {
	useTypeImports: true,
	skipTypename: true,
};

const clientDocuments = [
	'client/$houdini/graphql/documents.gql',
	'client/src/**/*.graphql',
	'client/src/**/*.svelte',
	'client/src/**/*.server.ts',
];
const apiDocuments = ['api/tests/**/*.ts'];

const codegen: Types.Config = {
	ignoreNoDocuments: true,
	generates: {
		'api/tests/_generated/graphql/index.ts': {
			documents: [...apiDocuments, '!client/**/*'],
			plugins: [
				{
					typescript: {
						...tsCommonConfig,
					} as TypeScriptPluginConfig,
				},
				{
					'typescript-operations': {
						...tsCommonConfig,
					} as TypeScriptDocumentsPluginConfig,
				},
				{
					'typed-document-node': {
						...tsCommonConfig,
					} as TypeScriptTypedDocumentNodesConfig,
				},
			],
		},
	},
};

const config: IGraphQLConfig = {
	schema: ['./api/src/_generated/nestjs-graphql/schema.gql', './client/$houdini/graphql/schema.graphql'],
	documents: [...clientDocuments, ...apiDocuments],
	extensions: {
		codegen,
	},
};

export default config;
