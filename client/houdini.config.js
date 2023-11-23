/** @type {import('houdini').ConfigFile} */
const config = {
	schemaPath: './$houdini/graphql/generated-api-schema.gql',
	watchSchema: {
		url: 'http://localhost:3000/graphql',
	},
	defaultCachePolicy: 'NetworkOnly',
	plugins: {
		'houdini-svelte': {
			framework: 'kit',
			client: './src/lib/houdini/client.ts',
		},
	},
	defaultFragmentMasking: 'disable',
	types: {
		User: {
			keys: ['email'],
		},
		LiveUser: {
			keys: ['email'],
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
