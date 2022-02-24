import { defineConfig } from 'vite-plugin-windicss';
// import tailwindForms from 'windicss/plugin/forms';

export default defineConfig({
	darkMode: 'class',
	preflight: false,
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				// '2xl': '6rem',
			},
		},
		// colors: {
		// 	test: {
		// 		100: 'blue',
		// 		200: 'red',
		// 	},
		// },
	},
	// plugins: [tailwindForms],
});
