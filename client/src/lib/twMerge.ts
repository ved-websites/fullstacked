import { extendTailwindMerge, validators } from 'tailwind-merge';

type AdditionalClassGroupIDs = 'size';

export const twMerge = extendTailwindMerge<AdditionalClassGroupIDs>({
	extend: {
		classGroups: {
			size: [{ s: [validators.isNumber, validators.isArbitraryNumber] }],
		},
		conflictingClassGroups: {
			size: ['w', 'h'],
		},
	},
});
