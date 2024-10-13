/* eslint-disable @typescript-eslint/no-magic-numbers */

import env from '$configs';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Environment } from '~env';

Sentry.init({
	dsn: env.SENTRY_DSN,
	integrations: [nodeProfilingIntegration()],

	environment: env.NODE_ENV === Environment.Production ? 'api-prod' : 'api-dev',

	// Add Tracing by setting tracesSampleRate
	// We recommend adjusting this value in production
	tracesSampleRate: env.NODE_ENV !== Environment.Production ? 1.0 : 0.1,

	// Set sampling rate for profiling
	// This is relative to tracesSampleRate
	profilesSampleRate: 1.0,
});
