import { build, files, timestamp } from '$service-worker';
import { precacheAndRoute, precache } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('message', (event) => {
	if (event.data?.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

precacheAndRoute([
	...build.map((url) => {
		return {
			url,
			revision: null
		};
	}),
	...files.map((url) => {
		return {
			url,
			revision: `${timestamp}`
		};
	})
]);

// Edit the list of routes so they get cached and routed correctly, allowing
// cold start or hot reload to work offline.
// const skRoutes = ['/', '/about', '/todos'];
const skRoutes = ['/'];

precache(
	skRoutes.map((url) => {
		return {
			url,
			revision: `${timestamp}`
		};
	})
);

registerRoute(
	({ url }) => skRoutes.some((path) => url.pathname === path),
	new StaleWhileRevalidate()
);
