import type { PageDataObject } from './utils/page-data-object';

export type GraphQLError = {
	message: string;
	locations: {
		line: number;
		column: number;
	}[];
	path: string[];
	extensions: {
		code: string;
		stacktrace: string[];
		originalError: {
			message: string;
			error: string;
			statusCode: number;
		};
	};
};

export interface PageMessages extends PageDataObject {}

export type EventStep = 'hook' | 'action' | 'layout' | 'page' | 'resolved';
