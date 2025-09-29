<script lang="ts">
	import '../app.css';

	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import LayoutAlert from '$lib/components/LayoutAlert/LayoutAlert.svelte';
	import ToastManager from '$lib/components/ToastManager/ToastManager.svelte';
	import HasJs from '$lib/components/head/HasJS.svelte';
	import InitialTheme from '$lib/components/head/InitialTheme.svelte';
	import LanguageChecker from '$lib/components/head/LanguageChecker.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { contextKeys, setupContext } from '$lib/runes';
	import { themeStore } from '$lib/stores';
	import { wsClient, type WsClientType } from '$lib/ts-ws/client';
	import { WS_READY_STATES } from '$lib/ts-ws/readyStates';
	import type { PageMessages } from '$lib/types';
	import { flashStore } from '$lib/utils/flash';
	import { onDestroy, untrack } from 'svelte';
	import { removeKeys, rolesObjectIntersect } from '~shared';
	import { getTextFromRouteId } from '../i18n/utils';

	let { data = $bindable(), children } = $props();

	let contextData = setupContext(data);

	$effect.pre(() => {
		for (const contextKey of contextKeys) {
			// @ts-expect-error TS shenanigans to get confirmed data.
			contextData[contextKey] = data[contextKey];
		}
	});

	const flash = flashStore();

	const titleHeader = 'Fullstacked';
	const titleI18nText = $derived(getTextFromRouteId(data.i18n.t, (path) => `${path}.title`));

	let title = $derived(titleI18nText ? `${titleHeader} - ${titleI18nText}` : titleHeader);

	$effect(() => {
		themeStore.set(data.theme ?? null);
	});

	let formData = $derived(page.form as PageMessages | undefined);

	let layoutAlert = $derived($flash?.layoutAlert || data.layoutAlert || page.data.layoutAlert || formData?.layoutAlert);
	let toasts = $derived([...(untrack(() => page.data.toasts) ?? []), ...($flash?.toasts ?? []), ...(formData?.toasts ?? [])]);

	let sessionUnsubscriber: ReturnType<WsClientType['users']['edited']> | undefined;

	afterNavigate(async () => {
		if (!sessionUnsubscriber && data.sessionUser) {
			if (wsClient.$socket.readyState !== WS_READY_STATES.OPEN) {
				wsClient.$socket.connect();
			}

			sessionUnsubscriber = wsClient.users.edited({ id: data.sessionUser.id }, ({ data: rawEditedUserData }) => {
				const editedUserData = removeKeys(rawEditedUserData, 'online');

				const hadSameRoles =
					data.sessionUser!.roles.length === editedUserData.roles.length &&
					!rolesObjectIntersect(data.sessionUser!.roles, editedUserData.roles);

				data.sessionUser = editedUserData;

				if (!hadSameRoles) {
					wsClient.$socket.close();
					wsClient.$socket.connect();
				}

				invalidateAll();
			});
		} else if (!data.sessionUser) {
			const hadSession = !!sessionUnsubscriber;

			if (hadSession) {
				sessionUnsubscriber!();
				sessionUnsubscriber = undefined;
			}

			wsClient.$socket.close();

			if (hadSession) {
				invalidateAll();
			}
		}
	});

	let serverDownRefreshInterval: ReturnType<typeof setInterval> | undefined;

	$effect(() => {
		if (data.sessionUser === undefined) {
			if (serverDownRefreshInterval === undefined) {
				const refreshDelayInSeconds = 10;

				serverDownRefreshInterval = setInterval(() => {
					invalidateAll();
				}, refreshDelayInSeconds * 1000);
			}
		} else {
			clearInterval(serverDownRefreshInterval);
			serverDownRefreshInterval = undefined;
		}
	});

	onDestroy(() => {
		clearInterval(serverDownRefreshInterval);
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<HasJs />
<InitialTheme />
<LanguageChecker />

<Navbar />

<ToastManager data={toasts} />

<main class="container mx-auto mt-18 py-3 px-5 flex flex-col gap-3">
	<LayoutAlert data={layoutAlert} />

	{@render children?.()}
</main>
