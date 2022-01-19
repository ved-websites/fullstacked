/** @type {import('svelte-preprocess').default} */
// @ts-ignore
const sveltePreprocess = require('svelte-preprocess');
// const { windi: windicssPreprocess } = require('svelte-windicss-preprocess');

const preprocessors = {
	svelte: sveltePreprocess({
		scss: {
			includePaths: ['theme'],
		},
	}),
	// windicss: windicssPreprocess(),
};

module.exports = {
	preprocess: Object.values(preprocessors),
	preprocessors,
};
