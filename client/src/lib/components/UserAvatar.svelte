<script lang="ts">
	import { getProfilePictureImageUrl } from '$lib/utils/images';
	import { Avatar, type AvatarProps } from 'flowbite-svelte';

	interface Props {
		profilePictureRef: string | undefined | null;
		online?: boolean | undefined | null;
		firstName?: string | null;
		lastName?: string | null;
		avatarProps?: AvatarProps;
	}

	let { profilePictureRef, online = undefined, firstName = null, lastName = null, avatarProps }: Props = $props();

	let profilePictureSrc = $derived(getProfilePictureImageUrl(profilePictureRef));

	const defaultDotOptions: AvatarProps['dot'] = { placement: 'top-right', size: 'md' };

	let dot = $derived<AvatarProps['dot']>(
		typeof online !== 'boolean' ? undefined : online ? { ...defaultDotOptions, color: 'green' } : defaultDotOptions,
	);
</script>

<Avatar {...avatarProps} src={profilePictureSrc} {dot}>
	{#if firstName || lastName}
		{firstName ? firstName.charAt(0) : ''}{lastName ? lastName.charAt(0) : ''}
	{/if}
</Avatar>
