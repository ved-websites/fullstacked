<script lang="ts">
	import Icon from '$/lib/components/Icon.svelte';
	import VDropzone from '$/lib/components/flowbite-custom/VDropzone.svelte';
	import { getProfilePictureImageUrl } from '$/lib/utils/images';
	import { browser } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import { mdiUpload } from '@mdi/js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button, Label } from 'flowbite-svelte';

	const ACCEPTED_PROFILE_PICTURE_TYPES = ['jpeg', 'jpg', 'png', 'webp'];

	export let currentProfilePictureRef: string | undefined | null;

	$: !currentProfilePictureRef && (profilePictureFile = undefined);

	let inputRef: HTMLInputElement;
	let profilePictureFile: File | undefined;
	let isSendingProfilePicture = false;

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

	const handleEnhance: SubmitFunction = () => {
		isSendingProfilePicture = true;
		return async ({ result }) => {
			const successTypes: (typeof result.type)[] = ['success', 'redirect'];

			if (successTypes.includes(result.type)) {
				console.log('yay');
				profilePictureFile = undefined;
			}

			isSendingProfilePicture = false;

			await applyAction(result);
		};
	};
</script>

<form method="post" enctype="multipart/form-data" use:enhance={handleEnhance} {...$$restProps}>
	<Label>Profile Picture</Label>
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
		accept={ACCEPTED_PROFILE_PICTURE_TYPES.map((type) => `image/${type}`).join(', ')}
		bind:input={inputRef}
		let:isDraggingOver
	>
		<div class="grid grid-cols-2 p-5 gap-3">
			<div class="flex flex-col justify-center items-center">
				<Icon path={mdiUpload}></Icon>
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					Accepted formats: {new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(ACCEPTED_PROFILE_PICTURE_TYPES)}.
				</p>
				{#if isDraggingOver}
					<p>Yes, right here!</p>
				{/if}
			</div>

			<div class="flex justify-center items-center">
				<img
					src={profilePictureFile ? URL.createObjectURL(profilePictureFile) : getProfilePictureImageUrl(currentProfilePictureRef)}
					alt="user profile"
					class="max-h-36"
				/>
			</div>
		</div>
	</VDropzone>

	<div class="mt-5 grid grid-cols-2 gap-5">
		<Button type="submit" formaction="?/deleteProfilePicture" disabled={!currentProfilePictureRef} color="red">Delete</Button>
		<Button type="submit" formaction="?/profilePicture" disabled={!(!browser || profilePictureFile) || isSendingProfilePicture}
			>Submit Profile Picture</Button
		>
	</div>
</form>
