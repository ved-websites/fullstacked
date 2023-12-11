<script lang="ts">
	import { getProfilePictureImageUrl } from '$lib/utils/images';
	import { Avatar } from 'flowbite-svelte';

	export let profilePictureRef: string | undefined | null;
	export let online: boolean | undefined | null = undefined;

	export let firstName: string | null = null;
	export let lastName: string | null = null;

	$: profilePictureSrc = getProfilePictureImageUrl(profilePictureRef);

	$: dot = (() => {
		if (typeof online !== 'boolean') {
			return;
		}

		if (online) {
			return { color: 'green' };
		}

		return {};
	})();

	$: ({ id, class: klass } = $$restProps);
</script>

{#if profilePictureSrc || firstName || lastName}
	<Avatar {id} class={klass} src={profilePictureSrc} {dot}>
		{firstName ? firstName.charAt(0) : ''}{lastName ? lastName.charAt(0) : ''}
	</Avatar>
{:else}
	<Avatar {id} class={klass} src={profilePictureSrc} {dot} />
{/if}
