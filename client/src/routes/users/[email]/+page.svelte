<script lang="ts">
	import UserForm from '$/lib/components/UserForm/UserForm.svelte';
	import { Heading, Helper, Label, MultiSelect } from 'flowbite-svelte';
	import type { SelectOptionType } from 'flowbite-svelte/dist/types';
	import { superForm } from 'sveltekit-superforms/client';

	const ACCEPTED_PROFILE_PICTURE_TYPES = ['jpeg', 'jpg', 'png', 'webp'];

	export let data;

	$: superFormData = superForm(data.form);
	$: ({ form, errors } = superFormData);

	$: availableRoles = data.roles.map<SelectOptionType>((role) => ({
		name: role.text,
		value: role.text,
	}));

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

<UserForm {superFormData} class="col-span-2 order-1 sm:order-none">
	<div slot="below">
		<Label>Roles</Label>
		<MultiSelect class="mt-2" items={availableRoles} bind:value={$form.roles} />
		{#if $errors.roles}<Helper class="mt-2" color="red">{$errors.roles}</Helper>{/if}
	</div>
</UserForm>
