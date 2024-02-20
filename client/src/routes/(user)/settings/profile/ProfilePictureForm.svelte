<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { getI18n } from '$i18n';
	import Icon from '$lib/components/Icon.svelte';
	import VDropzone from '$lib/components/flowbite-custom/VDropzone.svelte';
	import { getProfilePictureImageUrl } from '$lib/utils/images';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Label } from 'flowbite-svelte';
	import { ACCEPTED_PICTURE_TYPES } from '~shared';
	let i18n = getI18n();
	$: ({ t } = $i18n);

	export let currentProfilePictureRef: string | undefined | null;
	export let hasJs: boolean;

	let inputRef: HTMLInputElement;
	let profilePictureFile: File | undefined;
	let isSendingProfilePicture = false;

	$: !currentProfilePictureRef && (profilePictureFile = undefined);
	$: profilePictureSrc = profilePictureFile ? URL.createObjectURL(profilePictureFile) : getProfilePictureImageUrl(currentProfilePictureRef);

	const handlePictureDrop = (event: DragEvent) => {
		event.preventDefault();

		const files = event.dataTransfer?.items ?? event.dataTransfer?.files;

		if (!files || !files[0]) {
			return;
		}

		const file = files[0] instanceof DataTransferItem ? files[0].getAsFile() : files[0];

		if (!file) {
			return;
		}

		profilePictureFile = file;

		const dT = new DataTransfer();

		dT.items.add(profilePictureFile);
		inputRef.files = dT.files;
	};

	const handlePictureChange = (event: Event) => {
		const ref = event.target as HTMLInputElement;
		const files = ref.files;

		if (!files || !files[0]) {
			return;
		}

		profilePictureFile = files[0];
	};

	const handleEnhance: SubmitFunction = ({ action }) => {
		const actionType = action.search === '?/deleteProfilePicture' ? 'delete' : 'update';

		const prevRef = currentProfilePictureRef;
		const prevFile = profilePictureFile;

		if (actionType === 'delete') {
			currentProfilePictureRef = undefined;
		} else if (actionType === 'update') {
			if (profilePictureFile) {
				currentProfilePictureRef = URL.createObjectURL(profilePictureFile);
				profilePictureFile = undefined;
			}
		}

		isSendingProfilePicture = true;

		return async ({ result }) => {
			await applyAction(result);

			const successTypes: (typeof result.type)[] = ['success', 'redirect'];

			if (successTypes.includes(result.type)) {
				profilePictureFile = undefined;

				invalidate('data:sessionUser');
			} else if (actionType === 'delete') {
				currentProfilePictureRef = prevRef;
			} else if (actionType === 'update') {
				currentProfilePictureRef = prevRef;
				profilePictureFile = prevFile;
			}

			isSendingProfilePicture = false;
		};
	};
</script>

<form method="POST" enctype="multipart/form-data" use:enhance={handleEnhance} {...$$restProps}>
	<Label>{$t('settings.profile.picture.label')}</Label>
	<VDropzone
		id="dropzone"
		on:drop={handlePictureDrop}
		on:dragover={(event) => {
			// Required, otherwise the browser drop behavior executes
			event.preventDefault();
		}}
		on:change={handlePictureChange}
		name="profile-picture"
		class="mt-2"
		accept={ACCEPTED_PICTURE_TYPES.map((type) => `image/${type}`).join(', ')}
		bind:input={inputRef}
		let:isDraggingOver
	>
		<div class="grid grid-cols-2 p-5 gap-3">
			<div class="flex flex-col justify-center items-center">
				<Icon class="i-mdi-upload"></Icon>
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
					{@html $t('settings.profile.picture.zone.instructions', { hasJs })}
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					{$t('settings.profile.picture.zone.formats', {
						formats: new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(ACCEPTED_PICTURE_TYPES),
					})}
				</p>
				{#if isDraggingOver}
					<p>{$t('settings.profile.picture.zone.dragging')}</p>
				{/if}
			</div>

			<div class="flex justify-center items-center">
				{#if profilePictureSrc}
					<img src={profilePictureSrc} alt="user profile" class="max-h-36" />
				{:else}
					<Icon class="i-mdi-account-off-outline s-36"></Icon>
				{/if}
			</div>
		</div>
	</VDropzone>

	<div class="mt-5 grid grid-cols-2 gap-5">
		<Button type="submit" formaction="?/deleteProfilePicture" disabled={!currentProfilePictureRef} color="red">
			{$t('settings.profile.picture.buttons.delete')}
		</Button>
		<Button type="submit" formaction="?/profilePicture" disabled={(hasJs && !profilePictureFile) || isSendingProfilePicture}>
			{$t('settings.profile.picture.buttons.upload')}
		</Button>
	</div>
</form>
