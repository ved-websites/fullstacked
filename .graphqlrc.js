const dotenv = require('dotenv');

const apiEnv = dotenv.config({ path: `${__dirname}/api/.env` }).parsed ?? {};
const clientEnv = dotenv.config({ path: `${__dirname}/client/.env` }).parsed ?? {};

/** @type {import('@graphql-codegen/typescript-operations').TypeScriptDocumentsPluginConfig} */
const tsOperationConfig = {
	useTypeImports: true,
};

/** @type {import('@graphql-codegen/typed-document-node').TypeScriptTypedDocumentNodesConfig} */
const typedDocNodeConfig = {
	useTypeImports: true,
};

const clientCodegenConfig = {
	generates: {
		'client/src/graphql/@generated/index.ts': {
			plugins: [
				{
					typescript: {},
				},
				{
					'typescript-operations': tsOperationConfig,
				},
				{
					'typed-document-node': typedDocNodeConfig,
				},
			],
		},
	},
};

/** @type {import('graphql-config').IGraphQLConfig} */
const config = {
	projects: {
		api: {
			schema: `http://localhost:${apiEnv.PORT ?? 3000}/graphql`,
		},
		client: {
			schema: `${clientEnv.VITE_API_ADDR}/graphql`,
			documents: 'client/src/graphql/**/*.graphql',
			extensions: {
				codegen: clientCodegenConfig,
			},
		},
	},
};

module.exports = config;
