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
