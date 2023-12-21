<script lang="ts">
	import '../app.postcss';

	import { afterNavigate, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { SessionUserDataStore } from '$houdini';
	import { setI18n } from '$i18n';
	import LayoutAlert from '$lib/components/LayoutAlert/LayoutAlert.svelte';
	import ToastManager from '$lib/components/ToastManager/ToastManager.svelte';
	import HasJs from '$lib/components/head/HasJS.svelte';
	import InitialTheme from '$lib/components/head/InitialTheme.svelte';
	import LanguageChecker from '$lib/components/head/LanguageChecker.svelte';
	import Navbar from '$lib/components/nav/Navbar.svelte';
	import { subscribe } from '$lib/houdini/helper';
	import { setSessionUser, themeStore } from '$lib/stores';
	import type { PageMessages } from '$lib/types';
	import { getFlash } from 'sveltekit-flash-message/client';

	export let data;

	$: setI18n(data.i18n);
	$: setSessionUser(data.sessionUser);

	$: flash = getFlash(page);

	$: themeStore.set(data.theme ?? null);

	$: formData = $page.form as PageMessages | undefined;

	$: layoutAlert = $flash?.layoutAlert || $page.data.layoutAlert || formData?.layoutAlert;
	$: toasts = [...($page.data.toasts ?? []), ...($flash?.toasts ?? []), ...(formData?.toasts ?? [])];

	let sessionUnsubscriber: ReturnType<typeof subscribe>;

	afterNavigate(() => {
		if (data.sessionUser) {
			sessionUnsubscriber = subscribe([SessionUserDataStore, { email: data.sessionUser.email }], ({ data: editedUserData }) => {
				if (!editedUserData) {
					return;
				}

				data.sessionUser = editedUserData.userEdited;
				invalidateAll();
			});
		} else {
			sessionUnsubscriber?.();
		}
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
