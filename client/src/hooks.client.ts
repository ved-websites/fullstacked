import { dev } from '$app/environment';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import * as Sentry from '@sentry/sveltekit';
import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';

const SENTRY_PROD_SESSION_SAMPLE_RATE = 0.1;

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: dev ? 1.0 : SENTRY_PROD_SESSION_SAMPLE_RATE,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// If you don't want to use Session Replay, just remove the line below:
	integrations: [replayIntegration()],
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
