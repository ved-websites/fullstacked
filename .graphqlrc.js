const dotenv = require('dotenv');

const apiEnv = dotenv.config({ path: `${__dirname}/api/.env` }).parsed ?? {};
// const clientEnv = dotenv.config({ path: `${__dirname}/client/.env` }).parsed ?? {};

/** @type {import('graphql-config').IGraphQLConfig} */
const config = {
	schema: `http://localhost:${apiEnv.PORT ?? 3000}/graphql`,
	documents: 'client/src/graphql/**/*.graphql',
	extensions: {
		/** @type {import('@graphql-codegen/plugin-helpers').Types.Config} */
		codegen: {
			generates: {
				'client/src/graphql/@generated/index.ts': {
					plugins: [
						{
							/** @type {import('@graphql-codegen/typescript').TypeScriptPluginConfig} */
							typescript: {},
						},
						{
							/** @type {import('@graphql-codegen/typescript-operations').TypeScriptDocumentsPluginConfig} */
							'typescript-operations': {
								useTypeImports: true,
							},
						},
						{
							/** @type {import('@graphql-codegen/typed-document-node').TypeScriptTypedDocumentNodesConfig} */
							'typed-document-node': {
								useTypeImports: true,
							},
						},
					],
				},
			},
		},
	},
};

module.exports = config;
