<script lang="ts">
	import Icon from '$/lib/components/Icon.svelte';
	import VDropzone from '$/lib/components/flowbite-custom/VDropzone.svelte';
	import { getProfilePictureImageUrl } from '$/lib/utils/images';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { mdiUpload } from '@mdi/js';
	import { Button, Heading, Helper, Hr, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import UserForm from '../components/UserForm.svelte';
	import { ACCEPTED_PROFILE_PICTURE_TYPES } from '../components/userform.schema';

	export let data;

	$: superFormData = superForm(data.form, { dataType: 'json' });
	$: ({ errors } = superFormData);

	$: currentProfilePictureRef = data.sessionUser?.profilePictureRef;
	$: !currentProfilePictureRef && (profilePictureFile = undefined);

	let inputRef: HTMLInputElement;
	let profilePictureFile: File | undefined;

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
</script>

<Heading tag="h2" class="overflow-x-clip text-ellipsis">Editing user {data.editableUser?.email}</Heading>

<div class="grid grid-cols-1 sm:grid-cols-3 gap-y-5 sm:gap-10">
	<form method="post" enctype="multipart/form-data" use:enhance class="col-span-1 order-2 sm:order-none">
		<Hr classHr="sm:hidden" />
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
			<!-- <Icon path={mdiUpload}></Icon>
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">
				Accepted formats: {new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(ACCEPTED_PROFILE_PICTURE_TYPES)}.
			</p>
			{#if isDraggingOver}
				<p>Yes, right here!</p>
			{/if} -->
		</VDropzone>
		{#if $errors.profilePictureFile}
			<Helper class="mt-2" color="red">{$errors.profilePictureFile}</Helper>
		{/if}

		<div class="mt-5 grid grid-cols-2 gap-5">
			<Button type="submit" formaction="?/deleteProfilePicture" disabled={!currentProfilePictureRef} color="red">Delete</Button>
			<Button type="submit" formaction="?/profilePicture" disabled={!(!browser || profilePictureFile)}>Submit Profile Picture</Button>
		</div>
	</form>
	<UserForm action="?/user" {superFormData} roles={data.roles} class="col-span-2 order-1 sm:order-none" />
</div>
