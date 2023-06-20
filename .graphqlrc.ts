import type { Types } from '@graphql-codegen/plugin-helpers';
import type { TypeScriptTypedDocumentNodesConfig } from '@graphql-codegen/typed-document-node';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type { RawTypesConfig } from '@graphql-codegen/visitor-plugin-common';
import type { IGraphQLConfig } from 'graphql-config';

const tsCommonConfig: RawTypesConfig = {
	useTypeImports: true,
};

const codegen: Types.Config = {
	generates: {
		'client/src/graphql/@generated/index.ts': {
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
	watch: 'client/src/**/*',
};

const config: IGraphQLConfig = {
	schema: `http://localhost:3000/graphql`,
	documents: ['client/src/**/*.graphql', 'client/src/**/*.svelte'],
	extensions: {
		codegen,
	},
};

export default config;
