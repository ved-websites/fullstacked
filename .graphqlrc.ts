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

const codegen: Types.Config = {
	generates: {
		'client/src/graphql/@generated/index.ts': {
			documents: ['client/src/**/*.graphql', 'client/src/**/*.svelte', 'client/src/**/*.server.ts', 'client/src/lib/urql.ts'],
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
		'api/tests/@generated/graphql/index.ts': {
			documents: ['api/tests/**/*.ts'],
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
	schema: `http://localhost:3000/graphql`,
	extensions: {
		codegen,
	},
};

export default config;
