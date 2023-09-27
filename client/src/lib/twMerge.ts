import { extendTailwindMerge, validators } from 'tailwind-merge';

export const twMerge = extendTailwindMerge({
	classGroups: {
		size: [{ s: [validators.isNumber, validators.isArbitraryNumber] }],
	},
});
