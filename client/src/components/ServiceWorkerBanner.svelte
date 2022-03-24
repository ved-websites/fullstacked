<script lang="ts">
	import { browser, dev } from '$app/env';
	import Banner, { CloseReason, Icon, Label } from '@smui/banner';
	import Button from '@smui/button';
	import { messageSW, Workbox } from 'workbox-window';

	let wb: Workbox | undefined;
	let registration: ServiceWorkerRegistration | undefined;
	let offlineReady = false;
	let needRefresh = false;

	function showSkipWaitingPrompt(_event: unknown) {
		// \`event.wasWaitingBeforeRegister\` will be false if this is
		// the first time the updated service worker is waiting.
		// When \`event.wasWaitingBeforeRegister\` is true, a previously
		// updated service worker is still waiting.
		needRefresh = true;
	}

	async function updateServiceWorker() {
		// Assuming the user accepted the update, set up a listener
		// that will reload the page as soon as the previously waiting
		// service worker has taken control.
		if (wb) {
			wb.addEventListener('controlling', (event) => {
				if (event.isUpdate) window.location.reload();
			});
		}

		if (registration && registration.waiting) {
			try {
				// Send a message to the waiting service worker,
				// instructing it to activate.
				await messageSW(registration.waiting, { type: 'SKIP_WAITING' });
			} catch (e) {
				console.error('NOTIFIED SKIP_WAITING WITH ERROR', e);
			}
		}
	}

	if (!dev && browser) {
		if ('serviceWorker' in navigator) {
			wb = new Workbox('/service-worker.js', { scope: '/' });
			wb.addEventListener('activated', (event) => {
				// this will only controls the offline request.
				// event.isUpdate will be true if another version of the service
				// worker was controlling the page when this version was registered.
				if (!event.isUpdate) {
					offlineReady = true;
				}
			});

			// Add an event listener to detect when the registered
			// service worker has installed but is waiting to activate.
			wb.addEventListener('waiting', showSkipWaitingPrompt);

			// register the service worker
			(async () => {
				try {
					registration = await wb.register({ immediate: true });
				} catch (e) {
					console.error('cannot register service worker', e);
				}
			})();
		} else {
			console.warn('Service workers are not supported.');
		}
	}

	$: toast = offlineReady || needRefresh;

	function onCloseAction(event: CustomEvent<{ reason: CloseReason }>) {
		if (event.detail.reason == CloseReason.PRIMARY) {
			updateServiceWorker();
		} else {
			offlineReady = false;
			needRefresh = false;
		}
	}
</script>

<Banner bind:open={toast} centered mobileStacked on:SMUIBanner:closed={onCloseAction}>
	<Icon slot="icon" class="material-icons">priority_high</Icon>
	<Label slot="label">
		{#if offlineReady}
			App ready to work offline!
		{:else}
			New content available, click on reload button to update.
		{/if}
	</Label>
	<svelte:fragment slot="actions">
		<Button secondary>Close</Button>
		{#if needRefresh}
			<Button>Reload</Button>
		{/if}
	</svelte:fragment>
</Banner>
