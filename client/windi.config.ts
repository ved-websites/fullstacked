import { defineConfig } from 'vite-plugin-windicss';
// import tailwindForms from 'windicss/plugin/forms';

export default defineConfig({
	darkMode: 'media',
	// preflight: false,
	theme: {
		// defining screens for svelte-materialify
		// https://github.com/TheComputerM/svelte-materialify/blob/0d7dcd1/packages/svelte-materialify/src/styles/_variables.scss#L197-L201
		screens: {
			DEFAULT: '100%',
			sm: '600px',
			md: '940px',
			lg: '1264px', // 1280px - 16px
			xl: '1904px', // 1920px - 16px
			// '2xl': '1536px',
		},
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
