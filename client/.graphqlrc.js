const { loadEnv } = require('vite');

const viteEnv = loadEnv('development', process.cwd(), '');

/** @type {import('graphql-config').IGraphQLConfig} */
const config = {
	schema: `${viteEnv.VITE_API_ADDR}/graphql`,
};

module.exports = config;
