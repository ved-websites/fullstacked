/** @type {import('houdini').ConfigFile} */
const config = {
	schemaPath: '../api/src/_generated/nestjs-graphql/schema.gql',
	defaultCachePolicy: 'NetworkOnly',
	plugins: {
		'houdini-svelte': {
			framework: 'kit',
			client: './src/lib/houdini/client.ts',
		},
	},
	scalars: {
		DateTime: {
			type: 'Date',
			unmarshal(val) {
				return val ? new Date(val) : null;
			},
			marshal(date) {
				return date && date.getTime();
			},
		},
		Upload: {
			type: 'File',
		},
	},
};

export default config;
