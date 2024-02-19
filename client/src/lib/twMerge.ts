import { extendTailwindMerge, validators } from 'tailwind-merge';

type AdditionalClassGroupIDs = 'size';

export const cn = extendTailwindMerge<AdditionalClassGroupIDs>({
	extend: {
		classGroups: {
			size: [{ s: [validators.isNumber, validators.isArbitraryNumber] }],
		},
		conflictingClassGroups: {
			size: ['w', 'h'],
		},
	},
});
