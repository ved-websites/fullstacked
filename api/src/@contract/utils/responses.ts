import type { AppRoute } from '@ts-rest/core';
import { z } from 'zod';
import type { ApiFetcherData } from './tsRestFetcherApi';

export const commonErrorSchema = z.object({
	message: z.string(),
	error: z.string().optional(),
	statusCode: z.number().optional(),
});

export type CommonError = z.infer<typeof commonErrorSchema>;

// Cannot use `HttpStatus` as it messes up TS types
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const commonErrors = [400, 401, 403] as const;

export function isCommonError(data: ApiFetcherData): data is ApiFetcherData<CommonError> {
	return commonErrorSchema.safeParse(data.body).success;
}

export const defaultResponses = Object.fromEntries(commonErrors.map((e) => [e, commonErrorSchema])) as {
	[k in (typeof commonErrors)[number]]: typeof commonErrorSchema;
} satisfies AppRoute['responses'];

export function createResponses<const T extends AppRoute['responses']>(
	responses: T,
): typeof responses & Omit<typeof defaultResponses, keyof typeof responses> {
	return {
		...defaultResponses,
		...responses,
	};
}
