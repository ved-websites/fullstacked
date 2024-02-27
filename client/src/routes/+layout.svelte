<script lang="ts">
	import '../app.postcss';

	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { setI18n } from '$i18n';
	import LayoutAlert from '$lib/components/LayoutAlert/LayoutAlert.svelte';
	import ToastManager from '$lib/components/ToastManager/ToastManager.svelte';
	import HasJs from '$lib/components/head/HasJS.svelte';
	import InitialTheme from '$lib/components/head/InitialTheme.svelte';
	import LanguageChecker from '$lib/components/head/LanguageChecker.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { setSessionUser, themeStore } from '$lib/stores';
	import { wsClient, type WsClientType } from '$lib/ts-ws/client';
	import { WS_READY_STATES } from '$lib/ts-ws/readyStates';
	import type { PageMessages } from '$lib/types';
	import { flashStore } from '$lib/utils/flash';
	import { onDestroy } from 'svelte';
	import { removeKeys, rolesObjectIntersect } from '~shared';

	export let data;

	$: setI18n(data.i18n);
	$: setSessionUser(data.sessionUser);

	const flash = flashStore();

	$: themeStore.set(data.theme ?? null);

	$: formData = $page.form as PageMessages | undefined;

	$: layoutAlert = $flash?.layoutAlert || data.layoutAlert || $page.data.layoutAlert || formData?.layoutAlert;
	$: toasts = [...($page.data.toasts ?? []), ...($flash?.toasts ?? []), ...(formData?.toasts ?? [])];

	let sessionUnsubscriber: ReturnType<WsClientType['users']['edited']> | undefined;

	afterNavigate(async () => {
		if (wsClient.$socket.readyState !== WS_READY_STATES.OPEN && data.sessionUser) {
			wsClient.$socket.connect();

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

	$: if (data.sessionUser === undefined) {
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

	onDestroy(() => {
		clearInterval(serverDownRefreshInterval);
	});
</script>

<HasJs />
<InitialTheme />
<LanguageChecker />

<Navbar />

<ToastManager data={toasts} />

<main class="container mx-auto mt-20 py-3 px-5 flex flex-col gap-3">
	<LayoutAlert data={layoutAlert} />
	<slot />
</main>
