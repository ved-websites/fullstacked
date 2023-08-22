<script lang="ts">
	import Icon from '$/lib/components/Icon.svelte';
	import VDropzone from '$/lib/components/flowbite-custom/VDropzone.svelte';
	import { mdiUpload } from '@mdi/js';
	import { Helper, Label } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import UserForm from '../components/UserForm.svelte';

	export let data;

	const superFormData = superForm(data.form, { dataType: 'json' });

	$: ({ errors } = superFormData);

	let profilePicture: File | undefined;

	const handlePictureDrop = (event: DragEvent) => {
		event.preventDefault();

		const files = event.dataTransfer?.items ?? event.dataTransfer?.files;

		if (!files || !files[0]) {
			return;
		}

		const file = files[0] instanceof DataTransferItem ? files[0].getAsFile()! : files[0];

		profilePicture = file;
	};

	const handlePictureChange = (event: Event) => {
		const ref = event.target as HTMLInputElement;
		const files = ref.files;

		if (!files || !files[0]) {
			return;
		}

		profilePicture = files[0];
	};
</script>

<UserForm headerText="Editing user {data.editableUser?.email}" {superFormData} roles={data.roles}>
	<div slot="below">
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
			let:isDraggingOver
		>
			{#if !profilePicture}
				<Icon path={mdiUpload}></Icon>
				<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
				{#if isDraggingOver}
					<p>Yes, right here!</p>
				{/if}
			{:else}
				<img src={URL.createObjectURL(profilePicture)} alt="user profile" class="max-h-64" />
			{/if}
		</VDropzone>
		{#if $errors.profilePicture}
			<Helper class="mt-2" color="red">{$errors.profilePicture}</Helper>
		{/if}
	</div>
</UserForm>
