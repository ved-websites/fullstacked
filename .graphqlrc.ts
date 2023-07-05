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

const clientDocuments = ['client/src/**/*.graphql', 'client/src/**/*.svelte', 'client/src/**/*.server.ts', 'client/src/lib/urql.ts'];
const apiDocuments = ['api/tests/**/*.ts'];

const codegen: Types.Config = {
	ignoreNoDocuments: true,
	generates: {
		'client/src/graphql/@generated/index.ts': {
			documents: clientDocuments,
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
			documents: apiDocuments,
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
	documents: [...clientDocuments, ...apiDocuments],
	extensions: {
		codegen,
	},
};

export default config;
